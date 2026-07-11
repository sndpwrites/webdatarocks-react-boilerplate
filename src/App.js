import React, { lazy, Suspense, useCallback, useState } from "react";
import "./App.css";

const Pivot = lazy(() =>
  import("./webdatarocks.react").then(({ Pivot: PivotComponent }) => ({
    default: PivotComponent,
  }))
);

const REPORT_URL = "https://jsonplaceholder.typicode.com/posts/1/comments";

class PivotErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="status status--error" role="alert">
          The pivot table could not be loaded. Please refresh and try again.
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [dataError, setDataError] = useState(false);

  const handleDataError = useCallback(() => {
    setDataError(true);
  }, []);

  const handleDataLoaded = useCallback(() => {
    setDataError(false);
  }, []);

  return (
    <main className="App">
      {dataError && (
        <div className="status status--error" role="alert">
          The report data could not be loaded. Check your connection and try
          again.
        </div>
      )}
      <PivotErrorBoundary>
        <Suspense
          fallback={
            <div className="status" role="status">
              Loading pivot table…
            </div>
          }
        >
          <Pivot
            toolbar
            report={REPORT_URL}
            dataerror={handleDataError}
            dataloaded={handleDataLoaded}
          />
        </Suspense>
      </PivotErrorBoundary>
    </main>
  );
}

export default App;
