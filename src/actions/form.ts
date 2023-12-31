/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use server";

import { type FormSchema, formSchema } from "@/schemas/form";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";

class UserNotFoundErr extends Error {}

export async function GetFormStats() {
  const session = await getServerAuthSession();
  if (!session) throw new UserNotFoundErr();
  const user = session.user;
  const stats = await db.form.aggregate({
    where: { createdById: user.id },
    _sum: {
      submissions: true,
      visits: true,
    },
  });

  const visits = stats._sum.visits ?? 0;
  const submissions = stats._sum.submissions ?? 0;

  const submissionRate = visits ? (submissions / visits) * 100 : 0;

  const bounceRate = visits ? 100 - submissionRate : 0;

  return {
    visits,
    submissions,
    submissionRate,
    bounceRate,
  };
}

export async function CreateForm(data: FormSchema) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) throw validation.error;
  const session = await getServerAuthSession();
  if (!session) throw new UserNotFoundErr();
  const user = session.user;
  const form = await db.form.create({
    data: {
      name: data.name,
      description: data.description,
      createdById: user.id,
    },
  });
  if (!form) throw new Error("Falha ao criar formulário");
  return form.id;
}

export async function GetForms() {
  const session = await getServerAuthSession();
  if (!session) throw new UserNotFoundErr();
  const user = session.user;
  const forms = await db.form.findMany({
    where: { createdById: user.id },
    orderBy: { createdAt: "desc" },
  });
  return forms;
}

export async function GetFormById(id: string) {
  const session = await getServerAuthSession();
  if (!session) throw new UserNotFoundErr();
  const user = session.user;
  const form = await db.form.findFirst({
    where: { id, createdById: user.id },
  });
  return form;
}

export async function UpdateFormContent(id: string, JSONContent: string) {
  const session = await getServerAuthSession();
  if (!session) throw new UserNotFoundErr();
  const user = session.user;
  const JSONRaw = JSON.parse(JSONContent);
  const form = await db.form.update({
    where: { id, createdById: user.id },
    data: { content: JSONRaw },
  });
  return form;
}

export async function PublishForm(id: string, JSONContent: string) {
  const session = await getServerAuthSession();
  if (!session) throw new UserNotFoundErr();
  const user = session.user;
  const JSONRaw = JSON.parse(JSONContent);

  return await db.form.update({
    data: {
      published: true,
      content: JSONRaw,
    },
    where: {
      createdById: user.id,
      id,
    },
  });
}

export async function GetFormContentByUrl(formUrl: string) {
  return await db.form.update({
    select: {
      content: true,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
    where: {
      ShareURL: formUrl,
    },
  });
}

export async function SubmitForm(formUrl: string, content: string) {
  return await db.form.update({
    data: {
      submissions: {
        increment: 1,
      },
      FormSubmissions: {
        create: {
          content,
        },
      },
    },
    where: {
      ShareURL: formUrl,
      published: true,
    },
  });
}

export async function GetFormWithSubmissions(id: string) {
  const session = await getServerAuthSession();
  if (!session) throw new UserNotFoundErr();
  const user = session.user;

  return await db.form.findUnique({
    where: {
      createdById: user.id,
      id,
    },
    include: {
      FormSubmissions: true,
    },
  });
}
