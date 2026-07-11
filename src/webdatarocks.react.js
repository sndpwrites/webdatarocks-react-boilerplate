import React from "react";
import PropTypes from "prop-types";
import WebDataRocks from "webdatarocks";
import "webdatarocks/webdatarocks.min.css";

const CONFIG_PROPS = [
  "toolbar",
  "width",
  "height",
  "report",
  "global",
  "customizeCell",
  "beforetoolbarcreated",
];

const EVENT_PROPS = [
  "cellclick",
  "celldoubleclick",
  "dataerror",
  "datafilecancelled",
  "dataloaded",
  "datachanged",
  "fieldslistclose",
  "fieldslistopen",
  "filteropen",
  "fullscreen",
  "loadingdata",
  "loadinglocalization",
  "loadingreportfile",
  "localizationerror",
  "localizationloaded",
  "openingreportfile",
  "querycomplete",
  "queryerror",
  "ready",
  "reportchange",
  "reportcomplete",
  "reportfilecancelled",
  "reportfileerror",
  "reportfileloaded",
  "runningquery",
  "update",
];

const RECREATE_PROPS = CONFIG_PROPS.filter((prop) => prop !== "report");

export function buildConfig(props, container) {
  const config = { container, height: "100%" };

  [...CONFIG_PROPS, ...EVENT_PROPS].forEach((prop) => {
    if (props[prop] !== undefined) {
      config[prop] = props[prop];
    }
  });

  return config;
}

export class Pivot extends React.Component {
  containerRef = React.createRef();
  webdatarocks = null;

  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate(previousProps) {
    const requiresRecreation = RECREATE_PROPS.some(
      (prop) => previousProps[prop] !== this.props[prop]
    );

    if (requiresRecreation) {
      this.dispose();
      this.initialize();
      return;
    }

    if (!this.webdatarocks) {
      return;
    }

    if (previousProps.report !== this.props.report) {
      this.updateReport(this.props.report);
    }

    EVENT_PROPS.forEach((eventName) => {
      const previousHandler = previousProps[eventName];
      const nextHandler = this.props[eventName];

      if (previousHandler === nextHandler) {
        return;
      }
      if (previousHandler) {
        this.webdatarocks.off(eventName, previousHandler);
      }
      if (nextHandler) {
        this.webdatarocks.on(eventName, nextHandler);
      }
    });
  }

  componentWillUnmount() {
    this.dispose();
  }

  initialize = () => {
    if (this.containerRef.current) {
      this.webdatarocks = new WebDataRocks(
        buildConfig(this.props, this.containerRef.current)
      );
    }
  };

  updateReport = (report) => {
    if (typeof report === "string") {
      this.webdatarocks.load(report);
    } else if (report) {
      this.webdatarocks.setReport(report);
    } else {
      this.webdatarocks.clear();
    }
  };

  dispose = () => {
    if (this.webdatarocks) {
      this.webdatarocks.dispose();
      this.webdatarocks = null;
    }
  };

  render() {
    return (
      <div
        ref={this.containerRef}
        className="pivot-container"
        aria-label="Interactive pivot table"
      />
    );
  }
}

const dimensionType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
const eventPropTypes = EVENT_PROPS.reduce((propTypes, eventName) => {
  propTypes[eventName] = PropTypes.func;
  return propTypes;
}, {});

Pivot.propTypes = {
  toolbar: PropTypes.bool,
  width: dimensionType,
  height: dimensionType,
  report: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  global: PropTypes.object,
  customizeCell: PropTypes.func,
  beforetoolbarcreated: PropTypes.func,
  ...eventPropTypes,
};
