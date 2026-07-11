import React from "react";
import { render } from "@testing-library/react";
import WebDataRocks from "webdatarocks";
import { Pivot } from "./webdatarocks.react";

jest.mock("webdatarocks", () => jest.fn());

const createPivotApi = () => ({
  clear: jest.fn(),
  dispose: jest.fn(),
  load: jest.fn(),
  off: jest.fn(),
  on: jest.fn(),
  setReport: jest.fn(),
});

beforeEach(() => {
  WebDataRocks.mockReset();
});

test("initializes once with the DOM container and disposes on unmount", () => {
  const pivotApi = createPivotApi();
  WebDataRocks.mockImplementation(() => pivotApi);

  const { getByLabelText, unmount } = render(
    <Pivot toolbar report={{ dataSource: { data: [] } }} />
  );

  expect(WebDataRocks).toHaveBeenCalledTimes(1);
  expect(WebDataRocks).toHaveBeenCalledWith(
    expect.objectContaining({
      container: getByLabelText("Interactive pivot table"),
      height: "100%",
      toolbar: true,
    })
  );

  unmount();
  expect(pivotApi.dispose).toHaveBeenCalledTimes(1);
});

test("updates reports without recreating the pivot", () => {
  const pivotApi = createPivotApi();
  WebDataRocks.mockImplementation(() => pivotApi);
  const { rerender } = render(<Pivot report="first.json" />);

  rerender(<Pivot report="second.json" />);
  expect(pivotApi.load).toHaveBeenCalledWith("second.json");

  const report = { dataSource: { data: [{ value: 1 }] } };
  rerender(<Pivot report={report} />);
  expect(pivotApi.setReport).toHaveBeenCalledWith(report);
  expect(WebDataRocks).toHaveBeenCalledTimes(1);
});

test("rebinds changed event handlers", () => {
  const pivotApi = createPivotApi();
  WebDataRocks.mockImplementation(() => pivotApi);
  const firstHandler = jest.fn();
  const secondHandler = jest.fn();
  const { rerender } = render(<Pivot dataerror={firstHandler} />);

  rerender(<Pivot dataerror={secondHandler} />);

  expect(pivotApi.off).toHaveBeenCalledWith("dataerror", firstHandler);
  expect(pivotApi.on).toHaveBeenCalledWith("dataerror", secondHandler);
});

test("recreates the pivot only when a structural option changes", () => {
  const firstApi = createPivotApi();
  const secondApi = createPivotApi();
  WebDataRocks.mockImplementationOnce(() => firstApi).mockImplementationOnce(
    () => secondApi
  );
  const { rerender } = render(<Pivot toolbar={false} />);

  rerender(<Pivot toolbar />);

  expect(firstApi.dispose).toHaveBeenCalledTimes(1);
  expect(WebDataRocks).toHaveBeenCalledTimes(2);
});
