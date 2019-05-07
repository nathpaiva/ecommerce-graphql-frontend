import PelaseSignIn from '../components/PleaseSignIn';
import Order from '../components/Order';

const OrderPage = props => (
  <PelaseSignIn>
    <Order id={props.query.id} />
  </PelaseSignIn>
);

export default OrderPage;
