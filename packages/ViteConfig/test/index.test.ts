import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { afterEach, describe, expect, it } from "vitest";

import {
  createViteConfig,
  detectProjectFeatures,
  readProjectManifest,
} from "../src/index";

const tempDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempDirectories.splice(0).map((directory) =>
      rm(directory, { force: true, recursive: true }),
    ),
  );
});

describe("@utils/vite-config", () => {
  it("reads the nearest package manifest from the working directory", async () => {
    const directory = await mkdtemp(join(tmpdir(), "vite-config-"));
    tempDirectories.push(directory);

    const nestedDirectory = join(directory, "apps", "playground");
    await mkdir(nestedDirectory, { recursive: true });
    await writeFile(
      join(directory, "package.json"),
      JSON.stringify(
        {
          name: "fixture-project",
          dependencies: {
            react: "^19.2.5",
          },
        },
        null,
        2,
      ),
    );

    const manifest = await readProjectManifest(nestedDirectory);

    expect(manifest.name).toBe("fixture-project");
    expect(manifest.dependencies?.react).toBe("^19.2.5");
  });

  it("detects framework and style tooling from all dependency sections", () => {
    const features = detectProjectFeatures({
      dependencies: {
        react: "^19.2.5",
      },
      devDependencies: {
        vue: "^3.5.32",
      },
      peerDependencies: {
        unocss: "^66.6.8",
      },
      optionalDependencies: {
        tailwindcss: "^4.2.2",
      },
    });

    expect(features).toEqual({
      react: true,
      vue: true,
      unocss: true,
      tailwind: true,
    });
  });

  it("auto-loads plugins from the manifest and merges user config", async () => {
    const config = await createViteConfig({
      manifest: {
        dependencies: {
          react: "^19.2.5",
          vue: "^3.5.32",
        },
        devDependencies: {
          tailwindcss: "^4.2.2",
          unocss: "^66.6.8",
        },
      },
      config: {
        resolve: {
          alias: {
            "@": "/src",
          },
        },
      },
    });

    const plugins = flattenPlugins(config.plugins ?? []);
    const pluginNames = plugins.map((plugin) => plugin.name.toLowerCase());

    expect(pluginNames.some((name) => name.includes("react"))).toBe(true);
    expect(pluginNames.some((name) => name.includes("vue"))).toBe(true);
    expect(pluginNames.some((name) => name.includes("unocss"))).toBe(true);
    expect(pluginNames.some((name) => name.includes("tailwind"))).toBe(true);
    expect(config.resolve?.alias).toMatchObject({
      "@": "/src",
    });
  });

  it("lets explicit plugin flags override manifest auto-detection", async () => {
    const config = await createViteConfig({
      manifest: {
        dependencies: {
          react: "^19.2.5",
          vue: "^3.5.32",
        },
      },
      plugins: {
        react: false,
      },
    });

    const pluginNames = flattenPlugins(config.plugins ?? []).map((plugin) =>
      plugin.name.toLowerCase(),
    );

    expect(pluginNames.some((name) => name.includes("react"))).toBe(false);
    expect(pluginNames.some((name) => name.includes("vue"))).toBe(true);
  });
});

function flattenPlugins(value: unknown): Array<{ name: string }> {
  if (!Array.isArray(value)) {
    return isNamedPlugin(value) ? [value] : [];
  }

  return value.flatMap((entry) => flattenPlugins(entry));
}

function isNamedPlugin(value: unknown): value is { name: string } {
  return typeof value === "object" && value !== null && "name" in value;
}
