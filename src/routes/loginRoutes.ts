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

    if (name && email && password) {
        const newUser: User = { name, email, password };
        Users.push(newUser); 
        console.log("User added:", newUser); 
        next(); // Proceed to next route handler
    } else {
        res.status(400).send("All fields (name, email, and password) are required.");
    }
}

// Middleware to protect routes that require authentication
function RequireAuth(req: Request, res: Response, next: NextFunction) {
    if (req.session && req.session.loggedIn) {
        next();
        return;
    }
    res.status(403).send("You are not authorised to view this, please log in");
}

router.get('/', (req: Request, res: Response) => {
    if (req.session && req.session.loggedIn) {
        res.send(`<div><p>HOME PAGE</p><a href="/logout">Log Out</a></div>`);
    } else {
        res.redirect("/login");
    }
});

router.get('/login', (req: Request, res: Response) => {
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
        </form>`);
});

// Login handler
router.post("/login", (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = Users.find(u => u.email === email && u.password === password);
    
    if (user) {
        req.session = { loggedIn: true }; // Mark user as logged in
        res.redirect("/"); // Redirect to homepage
    } else {
        res.status(401).send("Invalid credentials");
    }
});

// Logout handler
router.get("/logout", (req: Request, res: Response) => {
    req.session = undefined; // Clear session to log out
    res.redirect("/login"); // Redirect to login page
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
