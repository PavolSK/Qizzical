import React from "react";
import "./indexjs.css"

export default function Index(props) {

    const [formData, setFormData] = React.useState({
        category: "9",
        difficulity: "easy"
    })

    function handleChange(event) {
        const {name, value} = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: value
            }
        })
    }

    React.useEffect(() => {
        props.handleForm(formData)
        props.handleChange()
    }, [formData])
    

    return (
        <div className="app">
            <div className="start-page">
                <h1 className="index-title">Quizzical</h1>
                <p className="index-text">Let's try your brain!</p>
                <p className="index-name">Pavol Danko</p>
                <form>
                    <label className="index--form-label" htmlFor="category">Choose a category:</label>
                    <select
                        id="category"
                        name="category"
                        onChange={handleChange}
                        value={formData.category}
                    >
                        <option value="9">General Knowledge</option>
                        <option value="27">Animals</option>
                        <option value="21">Sport</option>
                        <option value="11">Film</option>
                        <option value="10">Books</option>
                    </select>

                    <label className="index--form-label" htmlFor="difficulity">Choose a difficulity:</label>
                    <select
                        id="difficulity"
                        name="difficulity"
                        onChange={handleChange}
                        value={formData.difficulity}
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </form>
            </div>
        </div>
    )
}