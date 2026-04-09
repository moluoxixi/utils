import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { afterEach, describe, expect, it } from "vitest";

import {
  findNearestPackageJson,
  hasAnyDependency,
  hasDependency,
  readPackageManifest,
} from "../src/index";

const tempDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempDirectories.splice(0).map((directory) =>
      rm(directory, { force: true, recursive: true }),
    ),
  );
});

describe("@utils/core", () => {
  it("finds the nearest package.json while walking upward", async () => {
    const directory = await mkdtemp(join(tmpdir(), "utils-core-"));
    tempDirectories.push(directory);

    const nestedDirectory = join(directory, "packages", "demo");
    await mkdir(nestedDirectory, { recursive: true });
    await writeFile(join(directory, "package.json"), JSON.stringify({ name: "demo" }));

    await expect(findNearestPackageJson(nestedDirectory)).resolves.toBe(
      join(directory, "package.json"),
    );
  });

  it("reads the package manifest contents", async () => {
    const directory = await mkdtemp(join(tmpdir(), "utils-core-"));
    tempDirectories.push(directory);

    await writeFile(
      join(directory, "package.json"),
      JSON.stringify({
        name: "fixture",
        devDependencies: {
          vite: "^8.0.8",
        },
      }),
    );

    await expect(readPackageManifest(directory)).resolves.toMatchObject({
      name: "fixture",
      devDependencies: {
        vite: "^8.0.8",
      },
    });
  });

  it("detects dependencies across manifest sections", () => {
    const manifest = {
      dependencies: {
        react: "^19.2.5",
      },
      optionalDependencies: {
        tailwindcss: "^4.2.2",
      },
    };

    expect(hasDependency(manifest, "react")).toBe(true);
    expect(hasDependency(manifest, "vue")).toBe(false);
    expect(hasAnyDependency(manifest, ["vue", "tailwindcss"])).toBe(true);
  });
});
