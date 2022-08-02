import React, { useState } from 'react'
import styled from 'styled-components'

export const CriteriaForm = () => {

	const [urlParams, setUrlParams] = useState({

	})

	const onSubmit = () => {
		console.log(urlParams)
	}
	return (
		<div>
			<Form onSubmit={ onSubmit }>
				<select name="difficulty" id="">
					<option value="easy">Easy</option>
					<option value="medium">Medium</option>
					<option value="hard">Hard</option>
				</select>
				<select name="category" id="">
					<option value="any">Any</option>
					<option value="18">Computers</option>
					<option value="27">Animals</option>
					<option value="28">Vehicles</option>
					<option value="15">Video Games</option>
					<option value="20">Mythology</option>
				</select>
				<select name="" id=""></select>


			</Form>
		</div>
	)
}

const Form = styled.form `

`
