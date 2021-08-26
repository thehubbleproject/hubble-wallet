import genesis_goerli from "./genesis/genesis-goerli.json";
import genesis_local from "./genesis/genesis-local.json";

const getGenesisConfig = () => {
    if(process.env.REACT_APP_NETWORK === 'goerli') {
        return genesis_goerli
    } else if(process.env.REACT_APP_NETWORK === 'local') {
        return genesis_local
    }
    return genesis_local
}

const config = {
    GENESIS: getGenesisConfig(),
    BASE_URL: process.env.REACT_APP_PROPOSER_URL
}

export default config;