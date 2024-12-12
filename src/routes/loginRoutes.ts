import { Router, Request, Response, NextFunction } from "express";
const router = Router();

// User interface definition
interface User {
  name: string;
  email: string;
  password: string;
}

// Array to store users
const Users: User[] = [];

// sign up functionality middleware
function signupMiddleware(req: Request, res: Response, next: NextFunction) {
  const { name, email, password } = req.body;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!name) {
    res.status(400).send("Name is required.");
  }
  if (!email) {
    res.status(400).send("Email is required.");
  } else if (!regex.test(email)) {
    res.status(400).send("Invalid email format.");
  }
  if (!password) {
    res.status(400).send("Password is required.");
  } else if (!passwordRegex.test(password)) {
    res
      .status(400)
      .send(
        "Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character."
      );
  }

  // If all fields are valid
  const newUser = { name, email, password };

  console.log("User added:", newUser);
  console.log(" total users now :", Users);
  next(); // Proceed to the next middleware or route handler
}

// Middleware to protect routes that require authentication
function RequireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.loggedIn) {
    next();
    return;
  }
  res.redirect("/login");
}

router.get("/", RequireAuth, (req: Request, res: Response) => {
  res.send(
    `<div><p>HOME PAGE. Thanks for logging in</p><a href="/logout">Log Out</a></div>`
  );
});

router.get("/login", (req: Request, res: Response) => {
  res.send(`
        <p>Login Page</p>
        <form method="POST">
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <div>
                <button type="submit">Login</button>
            </div>
        </form>
        <a href="/signup">Dont have an account? Sign up</a>`);
});

// Login handler
router.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = Users.find((u) => u.email === email && u.password === password);

  if (user) {
    req.session = { loggedIn: true };
    res.redirect("/");
  } else {
    res.status(401).send("Invalid credentials");
  }
});

// Logout handler
router.get("/logout", (req: Request, res: Response) => {
  req.session = undefined;
  res.redirect("/login");
});

router.get("/signup", (req: Request, res: Response) => {
  res.send(`
        <h1>Sign Up</h1>
        <form method="POST">
            <div>
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <div>
                <button type="submit">Sign Up</button>
            </div>
        </form>`);
});

// POST handler for signup
router.post("/signup", signupMiddleware, (req: Request, res: Response) => {
  res.send(`
        <div>
            <p>You may now log in with the credentials you used to sign up</p>
            <a href="/login">Log In</a>
        </div>`);
});

// Protected route
router.get("/protect", RequireAuth, (req: Request, res: Response) => {
  res.send("Welcome to the protected route, logged-in user");
});

export { router };
