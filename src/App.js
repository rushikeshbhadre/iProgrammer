import './App.css';
import Pagination from "react-js-pagination";
import * as React from "react";
import './styles.css';

const itemsPerPage = 10;

const CardComponent = ({
                           isCompared,
                           image,
                           handleCompareButton,
                           handleRemoveButton
                       }) => {
    return (
        <div className="card" key={image.id}>
            <div>
                <img src={image.url} className="sample-image" alt=""/>
                <div><b>Title - </b> {image.title}</div>
                <div><b>Id - </b> {image.id}</div>
                <div><b>Url - </b> {image.url}</div>
            </div>
            <button
                data-id={image.id}
                onClick={() => isCompared ? handleRemoveButton() :  handleCompareButton()}>
                {isCompared ? "Remove" : "Compare"}
            </button>
        </div>);
}


export class App extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            allImages: [],
            selectedImagesObj: {},
            currentImages: [],
            activePage: 1
        }
    }

    componentDidMount() {
        fetch("https://jsonplaceholder.typicode.com/photos")
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response;
            })
            .then((response) => response.json())
            .then((allImages) => {
                const currentImages = allImages.slice(0, itemsPerPage);
                this.setState({
                    loading: false,
                    currentImages,
                    allImages
                })
            })
            .catch(() => console.error("error"));
    }

    handleButtonToggle = (image, isRemove) => {
        const {selectedImagesObj} = this.state;
        if(selectedImagesObj.hasOwnProperty(image.id)) {
            delete selectedImagesObj[image.id];
        } else {
            selectedImagesObj[image.id] = image;
        }
        this.setState({selectedImagesObj});
    }

    handleCompareButton = (image) => {
        const {selectedImagesObj} = this.state;
        selectedImagesObj[image.id] = image;
        this.setState({selectedImagesObj});
    }

    handleRemoveButton = (id) => {
        const {selectedImagesObj} = this.state;
        delete selectedImagesObj[id.toString()];
        this.setState({selectedImagesObj})
    }

    handlePageChange(pageNumber) {
        const currentImages = this.state.allImages.slice((pageNumber - 1) * itemsPerPage, (pageNumber - 1) * itemsPerPage + itemsPerPage);
        this.setState({
            currentImages,
            activePage: pageNumber
        });
    }

    render() {
        const {
            loading,
            selectedImagesObj,
            allImages,
            currentImages,
        } = this.state;
        const selectedImagesIds = Object.keys(selectedImagesObj);
        if (loading) {
            return <div className="message">Loading...</div>
        }
        return (
            <div className="App">
                <div className="main-wrapper">
                    <div className="first-container">
                        <div>
                            <Pagination
                                activePage={this.state.activePage}
                                itemsCountPerPage={50}
                                totalItemsCount={allImages.length}
                                pageRangeDisplayed={5}
                                onChange={this.handlePageChange.bind(this)}
                            />
                        </div>
                        <div className="card-wrapper">
                            {
                                currentImages.map((image, iIndex) => {
                                    return (<CardComponent
                                        isCompared={selectedImagesIds.indexOf(image.id.toString()) >= 0}
                                        image={image}
                                        handleCompareButton={this.handleCompareButton.bind(this, image)}
                                        handleRemoveButton={this.handleRemoveButton.bind(this, image.id)}
                                    />)
                                })
                            }
                        </div>
                        <div>
                            <Pagination
                                activePage={this.state.activePage}
                                itemsCountPerPage={50}
                                totalItemsCount={allImages.length}
                                pageRangeDisplayed={5}
                                onChange={this.handlePageChange.bind(this)}
                            />
                        </div>
                    </div>
                    <div className="second-container">
                        {
                            selectedImagesIds.length === 0
                                ? <div className="message">click on compare button to compare currentImages</div>
                                : <table>
                                    <tr>
                                        <th></th>
                                        <th>Id</th>
                                        <th>Url</th>
                                        <th>Title</th>
                                    </tr>
                                    <>
                                        {
                                            selectedImagesIds.map((id, iIndex) => {
                                                const image = selectedImagesObj[id];
                                                return (<tr key={image.albumId} key={image.id}>
                                                    <td>
                                                        <img src={image.thumbnailUrl} className={"thumbnail-img"}/>
                                                    </td>
                                                    <td>{image.id}</td>
                                                    <td>{image.url}</td>
                                                    <td>{image.title}</td>
                                                </tr>)
                                            })
                                        }
                                    </>
                                </table>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
