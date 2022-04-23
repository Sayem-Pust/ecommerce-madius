import React, {useState} from 'react';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import Dropzone from 'react-dropzone'

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const csrftoken = getCookie("csrftoken");


const CreateProduct = (props) => {
    const [productVariantPrices, setProductVariantPrices] = useState([]);
    console.log("vvvvvv", productVariantPrices);
  const [productName, setProductName] = useState("");
  const [productSKU, setProductSKU] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState([]);

    const [stock, setStock] = useState([]);


    const handlePrice = (value, index, code) => {
        let product_price = [...price];
        product_price[index] = {
          variationId: index,
            value: value,
          title: code
        };
        setPrice(product_price);
    }

    const handleStock = (value, index, code) => {
      let product_stock = [...stock];
      product_stock[index] = {
        stockId: index,
        value: value,
        title: code,
      };
      setStock(product_stock);
    };

  const [productVariants, setProductVariant] = useState([
    {
      option: 1,
      tags: [],
    },
  ]);
  console.log({productVariants});
//   console.log(typeof props.variants);
  // handle click event of the Add button
  const handleAddClick = () => {
    let all_variants = JSON.parse(props.variants.replaceAll("'", '"')).map(
      (el) => el.id
    );
    let selected_variants = productVariants.map((el) => el.option);
    let available_variants = all_variants.filter(
      (entry1) => !selected_variants.some((entry2) => entry1 == entry2)
    );
    setProductVariant([
      ...productVariants,
      {
        option: available_variants[0],
        tags: [],
      },
    ]);
  };

  // handle input change on tag input
    const handleInputTagOnChange = (value, index) => {
      
    let product_variants = [...productVariants];
    product_variants[index].tags = value;
    setProductVariant(product_variants);

    checkVariant();
  };

  // handle input change on variation input
    const handleVariationOnChange = (value, index) => {
      console.log(value, index);
        let product_variants = [...productVariants];
        console.log('fffff', product_variants[index].option);
        product_variants[index].option = value;
        console.log("rrrr", product_variants);
    setProductVariant(product_variants);

    checkVariant();
  };

  // remove product variant
  const removeProductVariant = (index) => {
    let product_variants = [...productVariants];
    product_variants.splice(index, 1);
    setProductVariant(product_variants);
  };

  // check the variant and render all the combination
  const checkVariant = () => {
    let tags = [];

    productVariants.filter((item) => {
      tags.push(item.tags);
    });

    setProductVariantPrices([]);

    getCombn(tags).forEach((item) => {
      setProductVariantPrices((productVariantPrice) => [
        ...productVariantPrice,
        {
          title: item,
          price: 0,
          stock: 0,
        },
      ]);
    });
    };
    
    const handleTestVariation = (e, index) => {
        console.log(e.target.value, e.target.name);
        console.log(productVariantPrices, index);
        let product_variants = [...productVariantPrices];
        if (e.target.name === 'price') {
            product_variants[index].price = e.target.value;
        }
        if (e.target.name === "stock") {
          product_variants[index].stock = e.target.value;
        }
        
        setProductVariantPrices(product_variants);
    }

  // combination algorithm
  function getCombn(arr, pre) {
    pre = pre || "";
    if (!arr.length) {
      return pre;
    }
    let ans = arr[0].reduce(function (ans, value) {
      return ans.concat(getCombn(arr.slice(1), pre + value + "/"));
    //   return ans.concat(getCombn(arr.slice(1), pre + value + "/"));
    }, []);
    return ans;
  }

  // Save product
  let saveProduct = async (event) => {
    event.preventDefault();
    console.log(productVariants);
    const data = {
      productName: productName,
      productSKU,
      description,
      productVariants,
      productVariantPrices,
    };
    const response = await fetch("http://127.0.0.1:8000/product/api/create/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(data),
    });
    console.log(productVariantPrices);
    console.log(productVariants);
  };

  return (
    <div>
      <section>
        <div className="row">
          <div className="col-md-6">
            <div className="card shadow mb-4">
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="">Product Name</label>
                  <input
                    type="text"
                    placeholder="Product Name"
                    className="form-control"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Product SKU</label>
                  <input
                    type="text"
                    placeholder="Product Name"
                    className="form-control"
                    value={productSKU}
                    onChange={(e) => setProductSKU(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Description</label>
                  <textarea
                    id=""
                    cols="30"
                    rows="4"
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="card shadow mb-4">
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">Media</h6>
              </div>
              <div className="card-body border">
                <Dropzone
                  onDrop={(acceptedFiles) => console.log(acceptedFiles)}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>
                          Drag 'n' drop some files here, or click to select
                          files
                        </p>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow mb-4">
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">Variants</h6>
              </div>
              <div className="card-body">
                {productVariants.map((element, index) => {
                  return (
                    <div className="row" key={index}>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="">Option</label>
                          <select
                            className="form-control"
                            defaultValue={element.option}
                            onChange={(e) =>
                              handleVariationOnChange(e.target.value, index)
                            }
                          >
                            {JSON.parse(
                              props.variants.replaceAll("'", '"')
                            ).map((variant, index) => {
                              return (
                                <option key={index} value={variant.id}>
                                  {variant.title}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>

                      <div className="col-md-8">
                        <div className="form-group">
                          {productVariants.length > 1 ? (
                            <label
                              htmlFor=""
                              className="float-right text-primary"
                              style={{ marginTop: "-30px" }}
                              onClick={() => removeProductVariant(index)}
                            >
                              remove
                            </label>
                          ) : (
                            ""
                          )}

                          <section style={{ marginTop: "30px" }}>
                            <TagsInput
                              value={element.tags}
                              style="margin-top:30px"
                              onChange={(value) =>
                                handleInputTagOnChange(value, index)
                              }
                            />
                          </section>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="card-footer">
                {productVariants.length !== 3 ? (
                  <button className="btn btn-primary" onClick={handleAddClick}>
                    Add another option
                  </button>
                ) : (
                  ""
                )}
              </div>

              <div className="card-header text-uppercase">Preview</div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <td>Variant</td>
                        <td>Price</td>
                        <td>Stock</td>
                      </tr>
                    </thead>
                    <tbody>
                      {productVariantPrices.map(
                        (productVariantPrice, index) => {
                          return (
                            <tr key={index}>
                              <td>{productVariantPrice.title}</td>
                              <td>
                                <input
                                  //   value={price.value}
                                  value={productVariantPrice.price}
                                  onChange={(e) =>
                                    handleTestVariation(e, index)
                                  }
                                  name="price"
                                  //   onChange={(e) =>
                                  //     handlePrice(
                                  //       e.target.value,
                                  //       index,
                                  //       productVariantPrice.title
                                  //     )
                                  //   }
                                  className="form-control"
                                  type="text"
                                />
                              </td>
                              <td>
                                <input
                                  value={stock.value}
                                  onChange={(e) =>
                                    handleTestVariation(e, index)
                                  }
                                  className="form-control"
                                  type="text"
                                  name="stock"
                                />
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          onClick={saveProduct}
          className="btn btn-lg btn-primary"
        >
          Save
        </button>
        <button type="button" className="btn btn-secondary btn-lg">
          Cancel
        </button>
      </section>
    </div>
  );
};

export default CreateProduct;
