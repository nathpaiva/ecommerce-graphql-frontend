import Reset from "../components/Reset";
// props.query.resetToken

const ResetPage = props => (
  <Reset resetToken={props.query.resetToken} />
);

export default ResetPage;
