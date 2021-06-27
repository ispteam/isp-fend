
const GridLayout = ({ gridCols, children }) => {
  return (
    <div className="container">
      <section className={"grid-container-style mr-10 md:" + gridCols}>
        {children}
      </section>
    </div>
  );
};

export default GridLayout;
