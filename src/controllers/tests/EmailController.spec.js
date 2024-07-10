// DESCRIBE -> Bloco testes - test suits
// IT or Test -> Declara teste individual - test cases
// EXPECT -> Asserções do resultado - validar

//Example test base;

// function sum(a, b) {
//   return a + b;
// }

// describe("Initial test", () => {
//   it("Firts unit test", () => {
//     const first = 7;
//     const second = 1;

//     let result = sum(first, second);

//     expect(result).toEqual(first + second);
//   });
// });

// describe("Initial test", () => {
//   it("Firts unit test", () => {
//     const first = 7;
//     const second = 1;

//     let result = sum(first, second);

//     expect(result).toEqual(first + second + 1);
//   });
// });

const EmailController = require("../EmailController");
const EmailQueue = require("../../queue/MailQueue");

jest.mock("../../queue/MailQueue");

describe("Email Controller", () => {
  test("Sent email successfully", async () => {
    const request = {
      body: {
        email: "teste@gmail",
        firstName: "Beatriz",
        lastName: "Goncalves",
      },
    };

    const reply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const template = `
    Olá ${request.body.firstName} ${request.body.lastName}, sua assinatura foi confirmada!
    Para acessar seus recursos exclusivos você precisa basta clicar aqui.
`;

    await EmailController.sendEmail(request, reply);

    expect(EmailQueue.add).toHaveBeenCalledTimes(1);
    // expect(EmailQueue.add).toHaveBeenCalledWith({
    //   to: "teste@gmail",
    //   from: process.env.EMAIL_FROM,
    //   subject: "Assinatura Confirmada",
    //   text: template,
    // });

    expect(reply.code).toHaveBeenCalledWith(200);
  });
});

describe("Email Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Sent email successfully", async () => {
    const request = {
      body: {
        email: "teste@gmail",
        firstName: "Beatriz",
        lastName: "Goncalves",
      },
    };

    const reply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const template = `Olá ${request.body.firstName} ${request.body.lastName}, sua assinatura foi confirmada! Para acessar seus recursos exclusivos você precisa basta clicar aqui.`;

    await EmailController.sendEmail(request, reply);

    expect(EmailQueue.add).toHaveBeenCalledTimes(1);
    expect(EmailQueue.add).toHaveBeenCalledWith({
      to: "teste@gmail",
      from: process.env.EMAIL_FROM,
      subject: "Assinatura Confirmada",
      text: template,
    });

    expect(reply.code).toHaveBeenCalledWith(200);
  });

  test("Sent email error", async () => {
    const request = {
      body: {
        email: "teste@gmail",
        firstName: "Beatriz",
        lastName: "Goncalves",
      },
    };

    const reply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    EmailQueue.add.mockRejectedValue(new Error("Mocking Error"));

    await EmailController.sendEmail(request, reply);

    expect(EmailQueue.add).toHaveBeenCalledTimes(1);
    expect(reply.code).toHaveBeenCalledWith(500);
    expect(reply.send).toHaveBeenCalledWith("Internal Server Error");
  });
});
