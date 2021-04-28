// @flow
import * as React from 'react';
import '../styles.css';
import Pagination from "react-js-pagination";

const itemsPerPage = 10;

const CardComponent = ({
                           isCompared,
                           image,
                           handleButtonToggle
                       }) => {
    return (
        <div className="card" key={image.id}>
            <div>
                <img src={image.url} className="sample-image" alt=""/>
                <div><b>Title - </b> {image.title}</div>
                <div><b>Id - </b> {image.id}</div>
                <div><b>Url - </b> {image.url}</div>
            </div>
            <button onClick={handleButtonToggle.bind(this, isCompared)}>
                {isCompared ? "Remove" : "Compare"}
            </button>
        </div>);
}

export class ImageComparator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            allImages: [],
            selectedImages: [],
            selectedImageIds: [],
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
            .catch(() => alert("error"));
    }

    handleButtonToggle = (image, isRemove) => {
        let {selectedImages, selectedImageIds} = this.state;
        debugger
        if (isRemove) {
            selectedImages = selectedImages.filter((iObj) => image.id !== iObj.id);
            selectedImageIds.splice(selectedImageIds.indexOf(image.id), 1);
        } else {
            selectedImages = [...selectedImages, image]
            selectedImageIds = [...selectedImageIds, image.id];
        }
        this.setState({selectedImages, selectedImageIds});
    }

    handlePageChange(pageNumber) {
        debugger
        const currentImages = this.state.allImages.slice((pageNumber - 1) * itemsPerPage, (pageNumber - 1) * itemsPerPage + itemsPerPage);
        this.setState({
            currentImages,
            activePage: pageNumber
        });
    }

    render() {
        const {
            loading,
            selectedImages,
            allImages,
            currentImages,
            selectedImageIds
        } = this.state;
        if (loading) {
            return <div className="message">Loading...</div>
        }
        return (
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
                                    isCompared={selectedImageIds.indexOf(image.id) >= 0}
                                    image={image}
                                    handleButtonToggle={this.handleButtonToggle.bind(this, image)}
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
                        selectedImageIds.length === 0
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
                                        selectedImages.map((image, iIndex) => {
                                            return (<tr key={image.albumId}>
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
        );
    };
};
