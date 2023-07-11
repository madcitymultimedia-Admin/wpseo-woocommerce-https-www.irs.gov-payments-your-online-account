import { addAction } from "@wordpress/hooks";

import initializeInputFocus, { inputFocus } from "../../src/initializers/input-focus";
import { getProductData } from "../../src/initializers/woo-identifiers";
import handleInputFocusForVariableProducts from "../../src/initializers/input-focus/variable-product";
import handleInputFocusForSimpleProducts from "../../src/initializers/input-focus/simple-product";

jest.mock( "@wordpress/hooks", () => (
	{
		addAction: jest.fn(),
	}
) );

jest.mock( "../../src/initializers/woo-identifiers", () => (
	{
		getProductData: jest.fn(),
	}
) );

jest.mock( "../../src/initializers/input-focus/variable-product", () => jest.fn() );
jest.mock( "../../src/initializers/input-focus/simple-product", () => jest.fn() );

describe( "The initializeInputFocus function", () => {
	it( "initializes the input focus action", () => {
		initializeInputFocus();

		expect( addAction ).toBeCalledWith( "yoast.focus.input", "yoast/wpseo-woocommerce/inputFocus", inputFocus );
	} );
} );

describe( "The inputFocus function", () => {
	it( "handles input focus for variable products", () => {
		getProductData.mockReturnValueOnce( {
			productType: "variable",
		} );

		inputFocus( "productSKU" );

		expect( getProductData ).toBeCalled();
		expect( handleInputFocusForVariableProducts ).toBeCalled();
	} );

	it( "handles input focus for simple products", () => {
		getProductData.mockReturnValueOnce( {
			productType: "simple",
		} );

		inputFocus( "productSKU" );

		expect( getProductData ).toBeCalled();
		expect( handleInputFocusForSimpleProducts ).toBeCalled();
	} );

	it(
		"does not handle input focus when the edit button next to the SKU or product identifiers assessments are not clicked",
		() => {
			getProductData.mockClear();
			handleInputFocusForVariableProducts.mockClear();
			handleInputFocusForSimpleProducts.mockClear();

			inputFocus( "someOtherAssessment" );

			expect( getProductData ).not.toBeCalled();
			expect( handleInputFocusForVariableProducts ).not.toBeCalled();
			expect( handleInputFocusForSimpleProducts ).not.toBeCalled();
		} );
} );