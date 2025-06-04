const request = require("supertest");
const app = require("../../app");
const db = require("../../database/queries");
const bcrypt = require("bcryptjs");
const { prisma } = require("../../server");
const { removeSession } = require("../utils/helper");

describe("auth.route.js", () => {
  // Przechowywanie danych testowych do późniejszego czyszczenia
  let testData = {
    usersToCleanup: [],
    emailsToCleanup: [],
    sessionsToCleanup: [],
  };

  // Helper do generowania unikalnych danych testowych
  const generateTestData = () => {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return {
      username: `testuser_${timestamp}_${randomSuffix}`,
      email: `test_${timestamp}_${randomSuffix}@example.com`,
      password: "TestPassword1",
    };
  };

  // Helper do rejestracji danych do późniejszego czyszczenia
  const trackForCleanup = (username, email) => {
    if (username) testData.usersToCleanup.push(username);
    if (email) testData.emailsToCleanup.push(email);
  };

  // Czyszczenie po każdym teście
  afterEach(async () => {
    // Usuń wszystkich użytkowników utworzonych w teście
    for (const username of testData.usersToCleanup) {
      try {
        await db.deleteUserByUsername(username);
      } catch (error) {
        // Ignoruj błędy - użytkownik może już nie istnieć
        console.warn(`Failed to cleanup user ${username}:`, error.message);
      }
    }

    // Usuń wszystkie emaile utworzone w teście
    for (const email of testData.emailsToCleanup) {
      try {
        await db.deleteUserByEmail(email);
      } catch (error) {
        console.warn(`Failed to cleanup email ${email}:`, error.message);
      }
    }

    // Wyczyść sesje jeśli są
    for (const session of testData.sessionsToCleanup) {
      try {
        await removeSession(session);
      } catch (error) {
        console.warn(`Failed to cleanup session:`, error.message);
      }
    }

    // Reset danych testowych
    testData = {
      usersToCleanup: [],
      emailsToCleanup: [],
      sessionsToCleanup: [],
    };
  });

  // Końcowe czyszczenie po wszystkich testach
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("Registration validation", () => {
    it("should fail if username is invalid", async () => {
      const testCases = [
        {
          username: "",
          message: "Username must be between 3 and 30 characters",
        },
        {
          username: "ab",
          message: "Username must be between 3 and 30 characters",
        },
        {
          username: "abab".repeat(21), // Tworzy string dłuższy niż 30 znaków
          message: "Username must be between 3 and 30 characters",
        },
        {
          username: "user@name",
          message: "Username can only contain letters, numbers and underscores",
        },
      ];

      // Używamy tego samego emaila dla wszystkich przypadków, bo testujemy tylko username
      const testEmail = generateTestData().email;

      for (const testCase of testCases) {
        const res = await request(app).post("/auth/register").send({
          username: testCase.username,
          email: testEmail,
          password: "Password1",
        });

        expect(res.status).toBe(400);
        expect(res.body.name).toBe("BadRequestError");
        expect(res.body.message).toMatch(testCase.message);
      }
    });

    it("should fail if password is too weak", async () => {
      const testCases = [
        {
          password: "weak",
          message: "Password must be at least 8 characters long",
        },
        {
          password: "12345678",
          message: "Password must contain at least one uppercase letter",
        },
        {
          password: "PASSWORD",
          message: "Password must contain at least one number",
        },
      ];

      for (const testCase of testCases) {
        const testUser = generateTestData();

        const res = await request(app).post("/auth/register").send({
          username: testUser.username,
          email: testUser.email,
          password: testCase.password,
        });

        expect(res.status).toBe(400);
        expect(res.body.name).toBe("BadRequestError");
        expect(res.body.message).toMatch(testCase.message);
      }
    });

    it("should fail if email is invalid", async () => {
      const testUser = generateTestData();

      const res = await request(app).post("/auth/register").send({
        username: testUser.username,
        email: "invalidemail", // Nieprawidłowy email
        password: testUser.password,
      });

      expect(res.status).toBe(400);
      expect(res.body.name).toBe("BadRequestError");
      expect(res.body.message).toMatch(/Please provide a valid email address/);
    });
  });

  describe("Successful registration", () => {
    it("should pass with valid data", async () => {
      const testUser = generateTestData();
      trackForCleanup(testUser.username, testUser.email);

      const res = await request(app).post("/auth/register").send({
        username: testUser.username,
        password: testUser.password,
        email: testUser.email,
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe(
        "User registered and logged in successfully!",
      );

      // Sprawdź czy użytkownik rzeczywiście został utworzony
      const createdUser = await db.getUserByUsername(testUser.username);
      expect(createdUser).toBeTruthy();
      expect(createdUser.email).toBe(testUser.email);
    });
  });

  describe("Duplicate user handling", () => {
    it("should fail with existing username", async () => {
      const testUser = generateTestData();
      trackForCleanup(testUser.username, testUser.email);

      // Najpierw utwórz użytkownika
      await db.createUser(testUser.username, testUser.password, testUser.email);

      // Teraz spróbuj utworzyć użytkownika z tym samym username
      const duplicateUser = generateTestData();
      const res = await request(app).post("/auth/register").send({
        username: testUser.username, // Ten sam username
        password: duplicateUser.password,
        email: duplicateUser.email, // Różny email
      });

      expect(res.status).toBe(409);
      expect(res.body.name).toBe("ConflictError");
    });

    it("should fail with existing email", async () => {
      const testUser = generateTestData();
      trackForCleanup(testUser.username, testUser.email);

      // Najpierw utwórz użytkownika
      await db.createUser(testUser.username, testUser.password, testUser.email);

      // Teraz spróbuj utworzyć użytkownika z tym samym emailem
      const duplicateUser = generateTestData();
      trackForCleanup(duplicateUser.username);

      const res = await request(app).post("/auth/register").send({
        username: duplicateUser.username, // Różny username
        password: duplicateUser.password,
        email: testUser.email, // Ten sam email
      });

      expect(res.status).toBe(409);
      expect(res.body.name).toBe("ConflictError");
    });
  });

  describe("Login functionality", () => {
    it("should fail with empty username or password", async () => {
      const testCases = [
        {
          username: "",
          password: "ValidPassword1",
        },
        {
          username: "validuser",
          password: "",
        },
      ];

      for (const testCase of testCases) {
        const res = await request(app).post("/auth/login").send(testCase);
        expect(res.status).toBe(400);
        expect(res.body.name).toBe("BadRequestError");
      }
    });

    it("should log in with correct credentials", async () => {
      const testUser = generateTestData();
      trackForCleanup(testUser.username, testUser.email);

      // Najpierw utwórz użytkownika z zahashowanym hasłem
      const hashedPassword = await bcrypt.hash(testUser.password, 10);
      await db.createUser(testUser.username, hashedPassword, testUser.email);

      // Teraz spróbuj się zalogować
      const res = await request(app).post("/auth/login").send({
        username: testUser.username,
        password: testUser.password, // Używamy oryginalnego hasła, nie zahashowanego
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Logged in successfully");
      expect(res.body.user).toBe(testUser.username);

      // Zapamiętaj sesję do czyszczenia
      testData.sessionsToCleanup.push(res);
    });

    it("should fail with incorrect password", async () => {
      const testUser = generateTestData();
      trackForCleanup(testUser.username, testUser.email);

      // Utwórz użytkownika
      const hashedPassword = await bcrypt.hash(testUser.password, 10);
      await db.createUser(testUser.username, hashedPassword, testUser.email);

      // Spróbuj zalogować się ze złym hasłem
      const res = await request(app).post("/auth/login").send({
        username: testUser.username,
        password: "WrongPassword123",
      });

      expect(res.status).toBe(401);
      expect(res.body.name).toBe("UnauthorizedError");
    });

    it("should fail with non-existent username", async () => {
      const testUser = generateTestData();

      const res = await request(app).post("/auth/login").send({
        username: testUser.username, // Użytkownik nie istnieje
        password: testUser.password,
      });

      expect(res.status).toBe(401);
      expect(res.body.name).toBe("UnauthorizedError");
    });
  });
});
