import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { prisma } from '@my-project/db';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

type UserResponse = {
  id: number;
  email: string;
  displayName: string;
};

type PostResponse = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorName: string;
  createdAt: string;
};

type PostInput = {
  title: string;
  content: string;
};

type AuthInput = {
  email: string;
  password: string;
  displayName: string;
};

//Antwort nach Login oder Registrierung
type AuthResponse = {
  token: string;
  user: UserResponse;
};

type ApiError = {
  message: string;
};

//für req.user
type AuthenticatedRequest = Request & {
  user?: {
    id: number;
    email: string;
  };
};


const app = express();
const PORT = Number(process.env.PORT ?? 3000);
const saltRounds = 10;
const jwtSecret = 'lab5-secret';


app.use(cors());
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});


const sendError = (res: Response<ApiError>, status: number, message: string) => {
  res.status(status).json({ message });
};

//Datenvorbereitung bevor die API sie an App sendet
const toUserResponse = (user: { id: number; email: string; displayName: string }): UserResponse => ({
  id: user.id,
  email: user.email,
  displayName: user.displayName,
});

const toPostResponse = (post: {
  id: number;
  title: string;
  content: string;
  authorId: number;
  author: {
    displayName: string;
  };
  createdAt: Date;
}): PostResponse => ({
  id: post.id,
  title: post.title,
  content: post.content,
  authorId: post.authorId,
  authorName: post.author.displayName,
  createdAt: post.createdAt.toISOString(),
});



const readPostInput = (req: Request): PostInput => ({
  title: typeof req.body?.title === 'string' ? req.body.title.trim() : '',
  content: typeof req.body?.content === 'string' ? req.body.content.trim() : '',
});

const readAuthInput = (req: Request): AuthInput => ({
  email: typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '',
  password: typeof req.body?.password === 'string' ? req.body.password : '',
  displayName: typeof req.body?.displayName === 'string' ? req.body.displayName.trim() : '',
});

const signToken = (user: { id: number; email: string }) =>
  jwt.sign({ userId: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' });

const requireAuth = (req: AuthenticatedRequest, res: Response<ApiError>, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return sendError(res, 401, 'Authentication required');
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as JwtPayload;
//prüft, ob der Token gültig, gibt zurück Payload - die Daten im Token (Benutzer id und e-mail)

    if (typeof payload.userId !== 'number' || typeof payload.email !== 'string') {
      return sendError(res, 401, 'Invalid token');
    }

    req.user = {
      id: payload.userId,
      email: payload.email,
    };
    next();
  } catch {
    sendError(res, 401, 'Invalid token');
  }
};



//Auth endpoints
app.post('/auth/register', async (req: Request, res: Response<AuthResponse | ApiError>) => {
  try {
    const input = readAuthInput(req); //lesen E-Mail, Passwort und Display Name aus dem Request und speichern sie in input

    if (!input.email || !input.displayName || input.password.length < 6) {
      return sendError(res, 400, 'Email, display name and a 6 character password are required');
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      return sendError(res, 409, 'Email is already registered');
    }

    const passwordHash = await bcrypt.hash(input.password, saltRounds);
    const user = await prisma.user.create({
      data: {
        email: input.email,
        displayName: input.displayName,
        passwordHash,
      },
    });

    res.status(201).json({
      token: signToken(user),
      user: toUserResponse(user),
    });
  } catch (error) {
    console.error(error);
    sendError(res, 500, 'Failed to register');
  }
});

app.post('/auth/login', async (req: Request, res: Response<AuthResponse | ApiError>) => {
  try {
    const input = readAuthInput(req);

    if (!input.email || !input.password) {
      return sendError(res, 400, 'Email and password are required');
    }

    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

    if (!passwordMatches) {
      return sendError(res, 401, 'Invalid email or password');
    }

    res.json({
      token: signToken(user),
      user: toUserResponse(user),
    });
  } catch (error) {
    console.error(error);
    sendError(res, 500, 'Failed to login');
  }
});

app.get('/auth/me', requireAuth, async (req: AuthenticatedRequest, res: Response<UserResponse | ApiError>) => {
  //requireAuth prüft Token
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      return sendError(res, 401, 'Invalid token');
    }

    res.json(toUserResponse(user));
  } catch (error) {
    console.error(error);
    sendError(res, 500, 'Failed to load user');
  }
});


// Post CRUD endpoints
app.get('/posts', async (_req: Request, res: Response<PostResponse[] | ApiError>) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(posts.map(toPostResponse)); // wandelt die Datenbank-Posts in API-Antwortobjekte um
  } catch (error) {
    console.error(error);
    sendError(res, 500, 'Failed to load posts');
  }
});

app.get('/posts/:id', async (req: Request, res: Response<PostResponse | ApiError>) => {
  try {
    const id = Number(req.params.id); // id vom Post

    if (Number.isNaN(id)) {
      return sendError(res, 400, 'Invalid post id');
    }

    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!post) {
      return sendError(res, 404, 'Post not found');
    }

    res.json(toPostResponse(post)); //schickt den Post als JSON an App zurück
  } catch (error) {
    console.error(error);
    sendError(res, 500, 'Failed to load post');
  }
});

app.post('/posts', requireAuth, async (req: AuthenticatedRequest, res: Response<PostResponse | ApiError>) => {
//requireAuth - nur eingeloggte Users dürfen Posts erstellen
  try {
    const input = readPostInput(req);

    if (!input.title || !input.content) {
      return sendError(res, 400, 'Title and content are required');
    }

    const post = await prisma.post.create({
      data: {
        title: input.title,
        content: input.content,
        authorId: req.user!.id,
      },
      include: { author: true }, //wird benutzt, damit die Antwort auch den Display Name des Autors enthält
    });

    res.status(201).json(toPostResponse(post));
  } catch (error) {
    console.error(error);
    sendError(res, 500, 'Failed to create post');
  }
});

app.patch('/posts/:id', requireAuth, async (req: AuthenticatedRequest, res: Response<PostResponse | ApiError>) => {
  try {
    const id = Number(req.params.id); // id vom Post

    if (Number.isNaN(id)) {
      return sendError(res, 400, 'Invalid post id');
    }

    const input = readPostInput(req);

    if (!input.title || !input.content) {
      return sendError(res, 400, 'Title and content are required');
    }

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return sendError(res, 404, 'Post not found');
    }

    if (existingPost.authorId !== req.user!.id) {
      return sendError(res, 403, 'Only the author can edit this post');
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title: input.title,
        content: input.content,
      },
      include: { author: true },
    });

    res.json(toPostResponse(post));
  } catch (error) {
    console.error(error);
    sendError(res, 500, 'Failed to update post');
  }
});

app.delete('/posts/:id', requireAuth, async (req: AuthenticatedRequest, res: Response<void | ApiError>) => {
  try {
    const id = Number(req.params.id); 

    if (Number.isNaN(id)) {
      return sendError(res, 400, 'Invalid post id');
    }

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return sendError(res, 404, 'Post not found');
    }

    if (existingPost.authorId !== req.user!.id) {
      return sendError(res, 403, 'Only the author can delete this post');
    }

    await prisma.post.delete({
      where: { id },
    });

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    sendError(res, 500, 'Failed to delete post');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
