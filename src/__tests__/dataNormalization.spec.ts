import { describe, it, expect } from "vitest";

function normalizeOption(opt: any) {
  const imageUrl = opt.imageUrl ?? opt.image_url ?? null;
  return { ...opt, imageUrl };
}

describe("Data normalization", () => {
  it("maps image_url to imageUrl", () => {
    const input = {
      title: "Opção",
      image_url: "https://res.cloudinary.com/x/y.webp",
    };
    const out = normalizeOption(input);
    expect(out.imageUrl).toBe(input.image_url);
  });

  it("keeps imageUrl when present", () => {
    const input = {
      title: "Opção",
      imageUrl: "https://res.cloudinary.com/x/y.webp",
    };
    const out = normalizeOption(input);
    expect(out.imageUrl).toBe(input.imageUrl);
  });

  it("sets imageUrl null when none", () => {
    const input = { title: "Opção" };
    const out = normalizeOption(input);
    expect(out.imageUrl).toBeNull();
  });
});
