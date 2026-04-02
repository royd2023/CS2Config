import { useCrosshairStore } from '@/stores/crosshairStore';
import { useConfigStore } from '@/stores/configStore';

function App() {
  useCrosshairStore();
  useConfigStore();
  return <div className="p-4 text-white bg-gray-900 min-h-screen">CS2 Setup Builder</div>
}
export default App;
