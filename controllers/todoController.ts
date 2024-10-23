import { Context } from "hono";
import { StatusCodes } from "http-status-codes";

import * as todoService from "../services/todoService";
import { createError, createResponse } from "../utils/responseUtils";
import { TODO_VALIDATION_ERRORS } from "../utils/validator";
import type { TodoInput } from "../types/todos";

export const createTodo = async (c: Context) => {
  const { title, content }: TodoInput = await c.req.parseBody();

  if (title) {
    const todo = await todoService.createTodo({ title, content });

    return c.json(createResponse(todo), StatusCodes.OK);
  } else {
    return c.json(
      createError(TODO_VALIDATION_ERRORS.INVALID_VALUE),
      StatusCodes.BAD_REQUEST
    );
  }
};

export const getTodos = async (c: Context) => {
  const { countOnly } = c.req.query();

  const todos = todoService.findTodos();

  if (todos) {
    if (countOnly) {
      return c.json(createResponse(todos.length), StatusCodes.OK);
    }
    return c.json(createResponse(todos), StatusCodes.OK);
  } else {
    return c.json(
      createError(TODO_VALIDATION_ERRORS.TODO_SOMETHING_WRONG),
      StatusCodes.BAD_REQUEST
    );
  }
};

export const getTodoById = (c: Context) => {
  const { id: todoId } = c.req.param();

  const todo = todoService.findTodo((todo) => todo.id === todoId);

  if (todo) {
    return c.json(createResponse(todo), StatusCodes.OK);
  } else {
    return c.json(
      createError(TODO_VALIDATION_ERRORS.TODO_SOMETHING_WRONG),
      StatusCodes.BAD_REQUEST
    );
  }
};

export const updateTodo = async (c: Context) => {
  const { id: todoId } = c.req.param();
  const { title, content }: TodoInput = await c.req.parseBody();

  const todo = todoService.findTodo((todo) => todo.id === todoId);

  if (todo) {
    await todoService.updateTodo(todo, { title, content });

    return c.json(createResponse(todo), StatusCodes.OK);
  } else {
    return c.json(
      createError(TODO_VALIDATION_ERRORS.TODO_SOMETHING_WRONG),
      StatusCodes.BAD_REQUEST
    );
  }
};

export const deleteTodo = async (c: Context) => {
  const { id: todoId } = c.req.param();

  const todo = todoService.findTodo((todo) => todo.id === todoId);

  if (!todo) {
    return c.json(
      createError(TODO_VALIDATION_ERRORS.TODO_SOMETHING_WRONG),
      StatusCodes.BAD_REQUEST
    );
  }

  await todoService.deleteTodo(todo);

  return c.json(createResponse(null), StatusCodes.OK);
};
