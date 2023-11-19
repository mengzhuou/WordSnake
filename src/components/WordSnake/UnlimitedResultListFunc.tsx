import { useLocation } from 'react-router-dom';
import UnlimitedGameoverBoard from './UnlimitedGameoverBoard';

type ResultListProps = {
  wordList: string[];
}

const UnlimitedResultListFunc: React.FC<ResultListProps> = (props) => {
  const location = useLocation();
  const { wordList } = location.state;
  return(
    <div>
        <UnlimitedGameoverBoard wordList={wordList}/>
    </div>
  );
};

export default UnlimitedResultListFunc;

