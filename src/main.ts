import { initShell } from './shell';
import { initDemoHooks } from './demo';
import { restoreActiveSimulations } from './services/simulation';
import './styles.css';

restoreActiveSimulations();
initDemoHooks();
initShell(document.getElementById('app')!);
