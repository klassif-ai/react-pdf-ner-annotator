import { createContext } from 'react';
import { Config } from '../interfaces/config';

interface ConfigContextProps {
	config: Config;
}

const ConfigContext = createContext<ConfigContextProps>({
	config: {},
});

ConfigContext.displayName = 'ConfigContext';
export default ConfigContext;
