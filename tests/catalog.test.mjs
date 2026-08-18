import assert from "node:assert/strict";
import test from "node:test";
import { filterProducts, normalizeSearchTerm } from "../src/lib/catalog.ts";

const categories = [{ slug: "reagentes", name: "Reagentes e kits", shortName: "Reagentes", description: "Rotina analítica", initialEditable: true }];
const products = [
  { slug: "beta", name: "Kit Beta", category: "reagentes", summary: "Controle", description: "Aplicação clínica", applications: ["Bioquímica"], image: "/beta.webp" },
  { slug: "alfa", name: "Reagente Alfa", category: "reagentes", summary: "Ensaio", description: "Pesquisa", applications: ["Hematologia"], image: "/alfa.webp", sku: "RA-10" },
];

test("normaliza acentos e encontra nome, SKU, aplicação e categoria", () => {
  assert.equal(normalizeSearchTerm("  Bioquímica  "), "bioquimica");
  assert.deepEqual(filterProducts(products, categories, { query: "RA-10" }).map((item) => item.slug), ["alfa"]);
  assert.deepEqual(filterProducts(products, categories, { query: "rotina analitica" }).map((item) => item.slug), ["beta", "alfa"]);
});

test("filtra categoria e ordena sem alterar o conjunto original", () => {
  assert.deepEqual(filterProducts(products, categories, { category: "reagentes", sort: "name-asc" }).map((item) => item.slug), ["beta", "alfa"]);
  assert.equal(products[0].slug, "beta");
});
