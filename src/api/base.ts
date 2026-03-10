// export const apiBase = "http://localhost:8000/api";
export const apiBase: string = "https://django-apis-two.vercel.app/api";

export const apiURL = (): string => {
  return `${apiBase}/dental`;
};