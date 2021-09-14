import React from "react";

const TicketsToPrint = (props) => {
    const { product , cliente} = props;

    console.log(product, cliente)
    return (
        <div className="font-dejavu">
            <div className="flex flex-col p-20 w-full">
                <p className="text-green-600 text-4xl font-bold text-center">Jhireth Cell</p>
                <p className="text-gray-800 text-4xl font-bold text-center">Garantia de compra</p>

                <br />
                <hr />
                <br />
                <p className="text-2xl px-16  py-16">Este documento hace constar que <strong> Jhireth Cell INC </strong> otorga la presente garantia de <strong> {product?.garantia}</strong> a  <strong> {cliente} </strong>  por el siguiente producto: </p>
                <ul className="text-2xl px-16 font-bold">
                    <li>{product?.producto}</li>
                    <li>Color: {product?.color}</li>
                    <li>Precio de venta: {product?.precio}</li>
                </ul>
                <br />
                <p className="text-2xl px-16 py-16">La garantia tiene cobertura del dia de hoy hasta el  {product?.fin_garantia}.
                
                Nuestra garantía incluye la reparación, reposición, o cambio del producto y/o componentes sin cargo alguno para el cliente, incluyendo mano de obra, así como los gastos de transportación derivados del cumplimiento de este certificado.
                </p>
                <br />
                <p className="text-2xl px-16">ESTA GARANTIA NO SERA VALIDA BAJO LAS SIGUIENTES CONDICIONES
    1.Cuando esta póliza manifestara claros signos de haber sido alterada en los datos originales consignados en ella.
    2. Cuando el uso, cuidado y operación del producto no haya sido de acuerdo con las instrucciones contenidas en el instructivo de operación.
    3. Cuando el producto haya sido usado fuera de su capacidad, maltratado, golpeado, expuesto a la humedad, molada por algún líquido o substancia corrosiva, así como por cualquiera otra falla atribuible al consumidor.
    4. Cuando el producto haya sido desarmado, modificado o reparado por personas no autorizadas por Manufacturera del Norte.
    5. Cuando la falla sea originada por el desgaste normal de las piezas debido al uso.
</p>
                <br />

                <div className="border-4 w-80 h-24 items-center text-center ml-16">
                    <p className="text-xl text-gray-500">Aqui debe ir pegado el sello con codigo de barra</p>
                </div>
                <h1 className="text-center pt-32">__________________________________</h1>
                <p className=" text-xl text-center font-bold" >Andrews Velasques</p>
                <p className=" text-xl text-center font-serif" >Propietario</p>

                <h1 className="text-center pt-20">__________________________________</h1>
                <p className=" text-xl text-center font-bold" ></p>
                <p className=" text-xl text-center font-serif" >Cliente</p>



            </div>
        </div>
    );
};
export default TicketsToPrint;
