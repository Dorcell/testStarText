import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter} from 'react-router-dom';
import Converter from './components/converter/Converter'
import {QueryClient, QueryClientProvider} from 'react-query'

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className='App'>
                <div className='heading'>
                    <h1>Currency converter</h1>
                </div>
                <BrowserRouter>
                    <Converter/>
                </BrowserRouter>
            </div>
        </QueryClientProvider>
    );
}

export default App;