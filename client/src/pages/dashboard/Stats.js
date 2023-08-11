import { useEffect } from "react";
import { useAppContext } from "../../context/appContext";
import { StatsContainer, Loading } from "../../components";

const Stats = () => {
  const { showStats, isLoading } = useAppContext();
  useEffect(() => {
    // eslint-disable-next-line
    showStats();
  }, []);

  if (isLoading) {
    return <Loading center />;
  }

  return (
    <div>
      <StatsContainer />
    </div>
  );
};

export default Stats;
