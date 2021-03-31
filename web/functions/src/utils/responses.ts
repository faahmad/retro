export const responses = {
  ok: () => ({ message: "Ok!" }),
  invalidMethod: (method: string) => ({ error: `Invalid ${method} request.` }),
  serverError: (error: Error) => ({ error: error.message })
};
