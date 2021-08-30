import { Fragment } from "react";

const GridLayout = ({chart,children}) => {
  return (
      <Fragment>
      {chart}
      <section className="grid-layout-container">
        {children}
      </section>
      </Fragment>
  );
};

export default GridLayout;
