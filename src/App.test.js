import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./webdatarocks.react", () => ({
  Pivot: ({ dataerror, dataloaded }) => (
    <div aria-label="Mock pivot table">
      <button onClick={dataerror}>Fail data load</button>
      <button onClick={dataloaded}>Complete data load</button>
    </div>
  ),
}));

test("loads the pivot table and reports data-loading failures", async () => {
  render(<App />);

  expect(await screen.findByLabelText("Mock pivot table")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Fail data load"));
  expect(screen.getByRole("alert")).toHaveTextContent(
    "The report data could not be loaded"
  );

  fireEvent.click(screen.getByText("Complete data load"));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
