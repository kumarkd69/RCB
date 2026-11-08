"use client";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";
import { structure } from "./src/sanity/structure";
import { apiVersion, dataset, projectId } from "./src/lib/sanity/env";

export default defineConfig({
  name: "namma-rcb-hq",
  title: "Namma RCB HQ — Club Admin",
  basePath: "/studio",
  projectId: projectId || "missing",
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
