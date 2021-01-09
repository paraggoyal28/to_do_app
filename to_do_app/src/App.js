import React, { Fragment } from 'react';
import './App.css';
import Item from './components/Item';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      idCount: 1, // count of the items
      textValue: '', // value of the input item.
      itemList: [], // original list of items
      filteredList: [], // search filtered list of items
      searchValue: '', // value of the search text field
      markedItemCount: 0, // items which are marked 
      unmarkedItemCount: 0, // items which are not marked.
      deletedItemCount: 0 // items which are deleted.
    }
  }


  handleKeyPress = (e) => {
    if (e.key === 'Enter') { // on pressing enter key we are submitting the response
      // declaring an item
      const item = {
        id: this.state.idCount,
        marked: false, // initially every item is unmarked,
        createdAt: new Date().toLocaleString(),
        lastUpdatedAt: new Date().toLocaleString(),
        deleted: false,
        text: e.target.value,
        description: "",
      }
      this.setState({
        itemList: [...this.state.itemList, item], idCount: this.state.idCount + 1,
        textValue: '', unmarkedItemCount: this.state.unmarkedItemCount + 1
      });
    }
  }

  handleTextChange = (e) => {
    // changing the text value of the item input box to be the value entered.
    this.setState({ textValue: e.target.value });
  }


  handleMarkingAll = (e) => {
    // if the mark all checkbox is checked then unmark all the checkboxes, and 
    // if the mark all checkbox is unchecked then mark all the checkboxes.
    const checkState = this.state.markedItemCount === this.state.itemList.length;
    const itemList = this.state.itemList.map(item => {
      item.marked = checkState === true ? false : true;
      return item;
    });
    // count the delete items so that they are not counted in marked and unmarked.
    const deletedItemCount = itemList.filter(item => item.deleted).length;
    const markedItemCount = itemList.filter(item => item.marked && !item.deleted).length;
    console.log(markedItemCount);
    const unmarkedItemCount = itemList.length - markedItemCount - deletedItemCount;
    this.setState({ itemList, markedItemCount, unmarkedItemCount, deletedItemCount });
  }

  handleDelete = (e) => {
    // handle Delete of a single item
    const id = e.target.dataset.num;
    const itemList = this.state.itemList.map(item => {
      if (parseInt(item.id) === parseInt(id)) {
        item.deleted = true;
      }
      return item;
    });

    this.setState({
      itemList,
      markedItemCount: this.state.markedItemCount - 1
    });

  }

  handleDeleteMarked = (e) => {
    // handle delete of all items that are marked.
    let markedDeleteCount = 0;
    const itemList = this.state.itemList.map(item => {
      if (item.marked) {
        markedDeleteCount++;
        item.deleted = true;
      }
      return item;
    });
    this.setState({
      itemList,
      markedItemCount: this.state.markedItemCount - markedDeleteCount, deletedItemCount: this.state.deletedItemCount + 1
    });
  }

  handleDescriptionChange = (e) => {
    // change the description of the item.
    const id = parseInt(e.target.dataset.num);
    const itemList = this.state.itemList.map(item => {
      if (parseInt(item.id) === id) {
        item.description = e.target.value;
      }
      return item;
    });
    this.setState({ itemList });
  }

  handleSearch = (e) => {
    // searching for a specific or list of items.
    const value = e.target.value;
    let filteredList = this.state.itemList;
    if (value.length >= 3) {
      filteredList = this.state.itemList.filter(item => (item.text &&
        item.text.toLowerCase().includes(value.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(value.toLowerCase())));
    }
    this.setState({ filteredList, searchValue: value });
  }

  handleKeyPressDescription = (e) => {
    // on pressing enter when the description is finished.
    if (e.key === 'Enter') {
      const descriptionBox = document.getElementById('descriptionInput' + e.target.dataset.num);
      const descriptionText = document.getElementById('description' + e.target.dataset.num);
      const id = parseInt(e.target.dataset.num);
      const itemList = this.state.itemList.map(item => {
        const words = item.description && item.description.slice(0, 140).split(' ') || [];
        const description = words && words.length && words.map(word => word.slice(0, 30)).join(' ') || '';
        if (parseInt(item.id) === id) {
          item.description = description;
          item.lastUpdatedAt = new Date().toLocaleString();
        }
        return item;
      });
      descriptionBox.style.display = 'none';
      descriptionText.style.display = 'inline-block';
      this.setState({ itemList });
    }
  }

  handleChangeSingle = (e) => {
    // handle checking and unchecking of a single item.
    const id = parseInt(e.target.dataset.num);
    const itemList = this.state.itemList.map(item => {
      if (parseInt(item.id) === id) {
        item.marked = !item.marked;
      }
      return item;
    });
    const deletedItemCount = itemList.filter(item => item.deleted).length;
    const markedItemCount = itemList.filter(item => item.marked && !item.deleted).length;
    const unmarkedItemCount = itemList.length - markedItemCount - deletedItemCount;
    this.setState({ itemList, markedItemCount, unmarkedItemCount, deletedItemCount });
  }


  render() {
    const { textValue, searchValue, filteredList, unmarkedItemCount, markedItemCount, itemList } = this.state;
    return (
      <Fragment>
        <div className="todoapp">
          <h1 className="heading">TODOS</h1>
          <input id="new-todo" type="text" value={textValue} onKeyPress={this.handleKeyPress} onChange={this.handleTextChange} placeholder="What needs to be done?" />
          {(unmarkedItemCount !== 0 || markedItemCount !== 0) &&
            (
              <Fragment>
                <input id="toggle-all" type="checkbox"
                  checked={markedItemCount === itemList.length}
                  onChange={this.handleMarkingAll} />
                <label htmlFor="toggle-all" >Mark all as complete</label>
                <input id="search-todo" type="text" value={searchValue} onChange={this.handleSearch} placeholder="What you want to search?" />

                {searchValue && searchValue.length >= 3 && filteredList.length >= 1 && filteredList.map(item =>
                  !item.deleted && (<Item key={item.id} item={item} handleDelete={this.handleDelete}
                    handleChangeSingle={this.handleChangeSingle}
                    handleKeyPress={this.handleKeyPressDescription}
                    handleDescriptionChange={this.handleDescriptionChange} />)
                )}


                {(!searchValue || searchValue.length < 3) && itemList.length >= 1 && itemList.map(item =>
                  !item.deleted && (<Item key={item.id} item={item} handleDelete={this.handleDelete}
                    handleChangeSingle={this.handleChangeSingle}
                    handleKeyPress={this.handleKeyPressDescription}
                    handleDescriptionChange={this.handleDescriptionChange} />)
                )}

                <div className="footer">
                  <span><b>{unmarkedItemCount}</b> items left </span>
                  {markedItemCount > 0 && <a id="clear-completed" onClick={this.handleDeleteMarked}>Clear {markedItemCount} completed items</a>}
                </div>

              </Fragment>)}
        </div>

        {this.state.deletedItemCount > 0 && (<div className="history">
          <h1>Completed Items:</h1>
          {itemList.map(item => {
            if (item.deleted) {
              return (
                <div className="history-item">
                  <h2>{item.text}</h2>
                  <p>{item.description}</p>
                  <span>{item.createdAt}</span><span>{item.lastUpdatedAt}</span>
                </div>
              );
            }
          })}
        </div>)}
      </Fragment>
    )

  }
}

export default App;