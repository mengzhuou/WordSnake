import React, { ChangeEvent } from "react";
import { getOnlineDefinition, isWordExist, getFromWordAddition, storeWordDefinition, deleteWordAdditionDefinition } from '../../helpers/connector';
import "./Menu.css";

interface AddWordModelProps {
  onClose: () => void
}

interface AddWordModelState {
  searchingWord: string,
  typedWord: string,
  searchingDefinition: string[],
  wordExist: boolean,
  isWordTyped: boolean,
  getFromData: string[],
  idSort: boolean,
  sortedData: string[],
}

class AdminAddWordModel extends React.Component<AddWordModelProps, AddWordModelState> {
  constructor(props: AddWordModelProps) {
    super(props);
    this.state = {
      searchingWord: "",
      typedWord: "",
      searchingDefinition: [],
      wordExist: false,
      isWordTyped: false,
      getFromData: [],
      idSort: false,
      sortedData: [],
    };
  }

  componentDidMount(): void {
    this.handleGetFromWordAddition();
  }

  componentDidUpdate(prevProps: AddWordModelProps, prevState: AddWordModelState){
    let sorted = [...this.state.getFromData];
    if (
      this.state.getFromData !== prevState.getFromData ||
      this.state.idSort !== prevState.idSort
    )
    {
      sorted.sort((a,b) => {
        const aId = parseInt(a.split(',')[0]);
        const bId = parseInt(b.split(',')[0]);
        return this.state.idSort ? bId - aId : aId - bId;
      });
      this.setState({ sortedData: sorted });
    }
  }

  handleRequestDelete = async(wordId: number) => {
    const isTrue = await deleteWordAdditionDefinition(wordId);
    if (isTrue) {
      window.alert('Successfully deleted!');
      this.handleGetFromWordAddition();
    } else{
      window.alert('Deletion failed.');
    }
  }

  handleRequestSubmit = async (wordId: number) => {
    const isTrue = await storeWordDefinition(wordId);
    if (isTrue) {
      window.alert('Successfully submitted!');
      this.handleGetFromWordAddition();
    } else{
      window.alert('Submission failed.');
    }
  }

  handleGetFromWordAddition = async() => {
    const temp = await getFromWordAddition();
    this.setState({ getFromData: temp })
  }

  handleOnlineSearch = async (searchingWord: string) => {
    const res = await getOnlineDefinition(searchingWord);
    if (Array.isArray(res)) {
      this.setState({ searchingDefinition: res });
    } else {
      console.error('Expected an array from getOnlineDefinition, got:', res);
    }
  }

  handleSearchValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputString = event.target.value;
    console.log("word typeing, ", this.state.isWordTyped)

    this.setState({
      searchingWord: inputString,
      isWordTyped: false
    });
  }

  handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {

      this.storeSearchValue(this.state.searchingWord).then(() => {
        this.setState({ searchingWord: ""});
      });
    }
  }

  storeSearchValue = async (inputValue: string) => {
    const exist = await isWordExist(inputValue);
    console.log("word typeing after stored", this.state.isWordTyped)


    this.handleOnlineSearch(inputValue);
    this.setState({ searchingWord: inputValue, typedWord: inputValue, wordExist: exist, isWordTyped: true })
  }

  handleIdHeaderClick = () => {
    this.setState((prevState) => ({ idSort: !prevState.idSort }));
  }


  render() {
    const { onClose } = this.props;
    const { getFromData } = this.state;
    console.log("getFromData", getFromData)

    return (
        <div className="adminAddWordModelPopup">
          <button className="fbClose-btn" onClick={onClose}>
            X
          </button>

          <div className="adminWordAddition">
            <table>
              <thead>
                <tr>
                  <th>
                    <button className="sortHeaderAW" onClick={this.handleIdHeaderClick}>
                      ID {this.state.idSort ? '▲' : '▼'}
                    </button>
                  </th>
                  <th>Email</th>
                  <th>Word</th>
                  <th>Definition</th>
                  <th colSpan={2}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.sortedData.map((data, index) => {
                  const match = data.match(/(^[^,]*),(.+),([^,]*),([^,]*$)/);
                  if (!match) {
                    console.error('Could not parse data:', data);
                    return null;
                  }
      
                  const [, id, definition, word, email] = match;
      
                  return (
                    <tr key={id} className="wordAdditionItem">
                      <td>{id}</td>
                      <td>{email}</td> 
                      <td>{word}</td>
                      <td>{definition}</td>  
                      <td className="buttonColumn">
                        <button className="submitButtonAW" onClick={() => this.handleRequestSubmit(parseInt(id))}>
                          Submit
                        </button>
                        <button className="deleteButtonAW" onClick={() => this.handleRequestDelete(parseInt(id))}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>

            </table>
          </div>
      </div>
    );
  }
}

export default AdminAddWordModel;
