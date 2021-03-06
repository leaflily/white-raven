import React from 'react';
import './Image.css';

class Image extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            thumb: '',
            full: null,
            thumbClass: this.props.className+' image-thumb',
            sizeFolder: 'small'
        };
        this.checkSize = this.checkSize.bind(this);
        this.windowWidth = 0;
    }
    componentWillMount() {
        var thumb = localStorage.getItem('thumb'+this.state.sizeFolder+this.props.fileName);
        if (thumb) {
            this.setState({
                thumb: thumb
            })
        }
        import(`../images/${this.state.sizeFolder}/thumbs/${this.props.fileName}`).then(img => this.setState({
            thumb: img.default
        }))
    }
    componentDidMount() {
        this.checkSize();
        this.importFull();
        window.addEventListener("resize", this.checkSize);
    };
    componentWillUnmount() {
        window.removeEventListener("resize", this.checkSize);
    };
    checkSize() {
        if (Math.abs(window.innerWidth - this.windowWidth) > 100) {
            this.windowWidth = window.innerWidth;
            var folders = ['small', 'medium', 'large', 'xlarge'];
            folders = folders.splice(0, this.props.sizeShifts.length);
            const folder = folders[this.props.sizeShifts.findIndex(s => s >= this.windowWidth)-1] || folders[folders.length-1];
            if (folder !== this.state.sizeFolder) {
                this.setState({
                    sizeFolder: folder
                }, () =>
                this.importFull()) 
            } 
        }
    }
    importFull() {
        this.full = import(`../images/${this.state.sizeFolder}/${this.props.fileName}`).then(img => this.setState({
            full: img.default
        }))
    }
    render() {
        return (
            <>
                    <img 
                        className={this.state.thumbClass} 
                        alt={this.props.alt} 
                        src={this.state.thumb} 
                        onLoad={() => this.setState({
                            thumbClass: this.state.thumbClass+' image-thumb--show'
                        })}
                    />
                    {  this.state.full && <img 
                        className={this.props.className+'image-full'}
                        alt=''
                        src={this.state.full}
                        onLoad={() => this.setState({
                            thumbClass: 'image-thumb image-thumb--hide'
                        })}
                    /> }
            </>
        )
    }
}

export default Image;