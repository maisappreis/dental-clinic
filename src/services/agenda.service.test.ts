import { AgendaService } from "./agenda.service";
import { http } from "@/api/http";
import { apiURL } from "@/api/base";

jest.mock("@/api/http", () => ({
  http: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("@/api/base", () => ({
  apiURL: jest.fn(),
}));

describe("AgendaService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (apiURL as jest.Mock).mockReturnValue("http://api.test");
  });

  it("list returns appointments", async () => {
    const mockData = [{ id: 1, name: "Consulta" }];

    (http.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await AgendaService.list();

    expect(http.get).toHaveBeenCalledWith("http://api.test/agenda/");
    expect(result).toEqual(mockData);
  });

  it("create sends payload and returns appointment", async () => {
    const payload = { name: "Consulta" };
    const mockData = { id: 1, name: "Consulta" };

    (http.post as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await AgendaService.create(payload as any);

    expect(http.post).toHaveBeenCalledWith(
      "http://api.test/agenda/create/",
      payload
    );
    expect(result).toEqual(mockData);
  });

  it("update sends payload and returns appointment", async () => {
    const payload = { id: 1, name: "Atualizado" };
    const mockData = { id: 1, name: "Atualizado" };

    (http.patch as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await AgendaService.update(payload as any);

    expect(http.patch).toHaveBeenCalledWith(
      "http://api.test/agenda/1/",
      payload
    );
    expect(result).toEqual(mockData);
  });

  it("remove calls delete endpoint", async () => {
    (http.delete as jest.Mock).mockResolvedValue({});

    await AgendaService.remove(1);

    expect(http.delete).toHaveBeenCalledWith("http://api.test/agenda/1/");
  });
});