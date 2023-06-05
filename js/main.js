import '../style.scss';
import * as bootstrap from 'bootstrap';

(async function () {
  const res = await fetch('http://localhost:3000');
  const data = await res.json();
  console.log(data);
})();
