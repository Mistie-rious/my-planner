import { createApp } from "@deroll/app";
import { createRouter } from "@deroll/router";
import { stringToHex, hexToString } from "viem";

async function sendNotice(app: any, payload: any) {
  await app.createNotice({
    payload: stringToHex(JSON.stringify(payload)),
  });
}

const app = createApp({ url: "http://127.0.0.1:5004" });
const router = createRouter({ app });

const userExpenses: Record<string, { amount: number; budget: number }> = {};
const userTasks: Record<
  string,
  { description: string; dueTime: number; completed: boolean }[]
> = {};

async function addExpense(
  app: any,
  userId: string,
  amount: number,
  budget: number,
) {
  if (!userExpenses[userId]) {
    userExpenses[userId] = { amount: 0, budget };
  }
  userExpenses[userId].amount += amount;

  if (userExpenses[userId].amount > userExpenses[userId].budget) {
    await sendNotice(app, { warning: "Budget exceeded!", userId });
  } else {
    await sendNotice(app, { message: "Expense added successfully", userId });
  }
}

async function createTask(
  app: any,
  userId: string,
  description: string,
  dueTime: number,
) {
  if (!userTasks[userId]) {
    userTasks[userId] = [];
  }
  userTasks[userId].push({ description, dueTime, completed: false });
  await sendNotice(app, { message: "Task created successfully", userId });
}

async function completeTask(app: any, userId: string, taskIndex: number) {
  if (userTasks[userId] && userTasks[userId][taskIndex]) {
    userTasks[userId][taskIndex].completed = true;
    await sendNotice(app, { message: "Task completed successfully", userId });
  } else {
    await sendNotice(app, { error: "Task not found", userId });
  }
}

// Advance handler to process incoming payloads
app.addAdvanceHandler(async ({ payload, timestamp }) => {
  let strPayload = hexToString(payload);
  let payloadProcessed = JSON.parse(strPayload);

  const { action, userId, amount, budget, description, dueTime, taskIndex } =
    payloadProcessed;

  switch (action) {
    case "ADD_EXPENSE":
      await addExpense(app, userId, amount, budget);
      break;

    case "CREATE_TASK":
      await createTask(app, userId, description, dueTime);
      break;

    case "COMPLETE_TASK":
      await completeTask(app, userId, taskIndex);
      break;

    default:
      await sendNotice(app, { error: "Invalid action", userId });
      break;
  }

  if (userTasks[userId]) {
    for (const task of userTasks[userId]) {
      if (!task.completed && timestamp > task.dueTime) {
        await app.createVoucher(
          JSON.stringify({
            type: "warining",
            message:
              "you have used run out of time to complete the assigned task",
          }),
        );
      }
    }
  }

  return "accept";
});

router.add<{ userId: string }>("expenses/:userId", ({ params: { userId } }) => {
  return JSON.stringify({
    expenses: userExpenses[userId] || { amount: 0, budget: 0 },
  });
});

router.add<{ userId: string }>("tasks/:userId", ({ params: { userId } }) => {
  return JSON.stringify({
    tasks: userTasks[userId] || [],
  });
});

router.add("all/:userId", ({ params: { userId } }) => {
  return JSON.stringify({
    expenses: userExpenses[userId] || { amount: 0, budget: 0 },
    tasks: userTasks[userId] || [],
  });
});

app.addInspectHandler(router.handler);

app.start().catch((e) => process.exit(1));
