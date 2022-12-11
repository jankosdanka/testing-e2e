import { mockData } from "./../../src/ts/services/__mocks__/movieservice";

beforeEach(() => {
  cy.visit("/");
});

describe("heading title", () => {
  it("should have a heading title", () => {
    cy.get("title").contains("Async testing");
  });
});

describe("inputfield", () => {
  it("should find input text", () => {
    cy.get("input").should("have.attr", "placeholder", "Skriv titel här");
  });
  it("should be able to find text value", () => {
    cy.get("input").should("have.attr", "placeholder", "Skriv titel här");
  });
  it("should be able to type text", () => {
    cy.get("input").type("Star").should("have.value", "Star");
  });
  it("should display error if input is less than 3 letters", () => {
    cy.get("input").type("ab");
    cy.intercept("GET", "http://omdbapi.com/*", {});
    cy.get("button").click();
    cy.get("p").contains("Inga sökresultat att visa");
  });

  it("should display error if user type numbers only", () => {
    cy.get("input").type("7345");
    cy.intercept("GET", "http://omdbapi.com/*", {});
    cy.get("button").click();
    cy.get("p").contains("Inga sökresultat att visa");
  });
});

describe("web request", () => {
  it("should get real data", () => {
    cy.get("input").type("Harry").should("have.value", "Harry");
    cy.get("button").click();
    cy.get("div.movie").contains("<h3>", "<img>");
    cy.get("h3").contains("Harry Potter");

    cy.get("div.movie").contains("<h3>", "<img>");
  });
  it("should get mockdata", () => {
    cy.intercept("GET", "http://omdbapi.com/*", mockData);
    cy.get("button").click();
    cy.get("div.movie").should("have.length", 3);
    cy.get("h3").contains("Harry Potter");
  });

  it("should not get data", () => {
    cy.intercept("GET", "http://omdbapi.com/*", {});
    cy.get("button").click();
    cy.get("p").contains("Inga sökresultat att visa");
  });

  it("should not accept empty inputfield", () => {
    cy.intercept("GET", "http://omdbapi.com/*", {});
    cy.get("button").click();
    cy.get("p").contains("Inga sökresultat att visa");
  });

  it("should have correct url call", () => {
    cy.get("input").type("Harry").should("have.value", "Harry");
    cy.intercept("GET", "http://omdbapi.com/*", mockData).as("movieCall");
    cy.get("button").click();
    cy.wait("@movieCall").its("request.url").should("contain", "Harry");
  });
});
