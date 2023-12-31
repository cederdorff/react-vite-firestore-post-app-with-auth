import { useEffect, useState } from "react";
import imgPlaceholder from "../assets/img/img-placeholder.jpg";

export default function PostForm({ savePost, post }) {
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (post?.caption && post?.image) {
            // if post, set the states with values from the post object.
            // The post object is a prop, passed from UpdatePage
            setCaption(post.caption);
            setImage(post.image);
        }
    }, [post]); // useEffect is called every time post changes.

    /**
     * handleImageChange is called every time the user chooses an image in the fire system.
     * The event is fired by the input file field in the form
     */
    function handleImageChange(event) {
        const file = event.target.files[0];
        if (file.size < 500000) {
            // image file size must be below 0,5MB
            const reader = new FileReader();
            reader.onload = event => {
                setImage(event.target.result);
            };
            reader.readAsDataURL(file);
            setErrorMessage(""); // reset errorMessage state
        } else {
            // if not below 0.5MB display an error message using the errorMessage state
            setErrorMessage("The image file is too big!");
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        const formData = {
            // create a new objebt to hold the value from states / input fields
            caption: caption,
            image: image
        };

        console.log(formData);

        const validForm = formData.caption && formData.image; // will return false if one of the properties doesn't have a value
        if (validForm) {
            // if all fields/ properties are filled, then call savePost
            savePost(formData);
        } else {
            // if not, set errorMessage state.
            setErrorMessage("Please, fill in all fields.");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Caption
                <input
                    type="text"
                    value={caption}
                    placeholder="Type a caption"
                    onChange={e => setCaption(e.target.value)}
                />
            </label>
            <label>
                Image
                <input
                    type="file"
                    className="file-input"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <img
                    className="image-preview"
                    src={image}
                    alt="Choose"
                    onError={event => (event.target.src = imgPlaceholder)}
                />
            </label>
            <p className="text-error">{errorMessage}</p>
            <button type="submit">Save</button>
        </form>
    );
}
