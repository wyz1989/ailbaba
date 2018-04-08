import './index.html';
import './index.less';
import dva from 'dva';
import 'antd/dist/antd.css';

import { browserHistory } from 'dva/router';

// 1. Initialize
//const app = dva();
const app = dva({
  history: browserHistory,
});

// 2. Plugins
//app.use({});

// 3. Model
//app.model(require('./models/apps'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
// a script tag to your application's JavaScript file(s).
