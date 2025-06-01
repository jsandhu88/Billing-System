import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

const InvoiceModal = ({
  isOpen,
  setIsOpen,
  invoiceInfo,
  items,
  onAddNextInvoice,
}) => {
  function closeModal() {
    setIsOpen(false);
  }

  const addNextInvoiceHandler = () => {
    setIsOpen(false);
    onAddNextInvoice();
  };

  const SaveAsPDFHandler = () => {
    const dom = document.getElementById("print");
    toPng(dom)
      .then((dataUrl) => {
        const img = new Image();
        img.crossOrigin = "annoymous";
        img.src = dataUrl;
        img.onload = () => {
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "in",
            format: [5.5, 8.5],
          });

          const imgProps = pdf.getImageProperties(img);
          const imageType = imgProps.fileType;
          const pdfWidth = pdf.internal.pageSize.getWidth();

          const pxFullHeight = imgProps.height;
          const pxPageHeight = Math.floor((imgProps.width * 8.5) / 5.5);
          const nPages = Math.ceil(pxFullHeight / pxPageHeight);

          let pageHeight = pdf.internal.pageSize.getHeight();

          const pageCanvas = document.createElement("canvas");
          const pageCtx = pageCanvas.getContext("2d");
          pageCanvas.width = imgProps.width;
          pageCanvas.height = pxPageHeight;

          for (let page = 0; page < nPages; page++) {
            if (page > 0) {
              pdf.addPage();
            }

            const w = pageCanvas.width;
            const h = pageCanvas.height;
            pageCtx.fillStyle = "white";
            pageCtx.fillRect(0, 0, w, h);
            pageCtx.drawImage(
              img,
              0,
              page * pxPageHeight,
              imgProps.width,
              pxPageHeight,
              0,
              0,
              imgProps.width,
              pxPageHeight
            );

            const imgData = pageCanvas.toDataURL(`image/${imageType}`, 1.0);
            pdf.addImage(imgData, imageType, 0, 0, pdfWidth, pageHeight);
          }

          pdf.save("invoice.pdf");
        };
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-50"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="my-8 inline-block w-full max-w-2xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
              <div className="p-6" id="print">
                <div className="mb-6 border-b border-gray-200 pb-4">
                  <h1 className="text-center text-2xl font-bold text-gray-900">
                    INVOICE
                  </h1>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Invoice Number</p>
                      <p className="font-semibold">{invoiceInfo.invoiceNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-semibold">{invoiceInfo.invoiceDate}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div>
                    <h2 className="mb-2 text-sm font-semibold text-gray-700">Bill To:</h2>
                    <p className="font-semibold">{invoiceInfo.customerName}</p>
                    {invoiceInfo.customerEmail && (
                      <p className="text-sm text-gray-600">{invoiceInfo.customerEmail}</p>
                    )}
                    {invoiceInfo.customerPhone && (
                      <p className="text-sm text-gray-600">{invoiceInfo.customerPhone}</p>
                    )}
                    {invoiceInfo.customerAddress && (
                      <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                        {invoiceInfo.customerAddress}
                      </p>
                    )}
                  </div>
                  <div>
                    <h2 className="mb-2 text-sm font-semibold text-gray-700">Payment Details:</h2>
                    {invoiceInfo.paymentTerms && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Terms:</span> {invoiceInfo.paymentTerms}
                      </p>
                    )}
                    {invoiceInfo.paymentMethod && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Method:</span> {invoiceInfo.paymentMethod}
                      </p>
                    )}
                    {invoiceInfo.dueDate && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Due Date:</span> {invoiceInfo.dueDate}
                      </p>
                    )}
                  </div>
                </div>

                <table className="w-full text-left">
                  <thead>
                    <tr className="border-y border-gray-200 bg-gray-50 text-sm">
                      <th className="py-2 px-4">ITEM</th>
                      <th className="py-2 px-4 text-center">QTY</th>
                      <th className="py-2 px-4 text-right">PRICE</th>
                      <th className="py-2 px-4 text-right">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-2 px-4">{item.name}</td>
                        <td className="py-2 px-4 text-center">{item.quantity}</td>
                        <td className="py-2 px-4 text-right">₹{Number(item.price).toFixed(2)}</td>
                        <td className="py-2 px-4 text-right">₹{Number(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-6 flex flex-col items-end space-y-2">
                  <div className="flex w-full max-w-xs justify-between">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="font-semibold">₹{invoiceInfo.subtotal.toFixed(2)}</span>
                  </div>
                  {invoiceInfo.discount > 0 && (
                    <div className="flex w-full max-w-xs justify-between">
                      <span className="text-sm text-gray-600">Discount:</span>
                      <span className="font-semibold">₹{invoiceInfo.discount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoiceInfo.gst > 0 && (
                    <div className="flex w-full max-w-xs justify-between">
                      <span className="text-sm text-gray-600">GST ({invoiceInfo.gst}%):</span>
                      <span className="font-semibold">₹{((invoiceInfo.gst * invoiceInfo.subtotal) / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex w-full max-w-xs justify-between border-t border-gray-200 pt-2">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">
                      ₹{invoiceInfo.grandTotal % 1 === 0 ? invoiceInfo.grandTotal : invoiceInfo.grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {invoiceInfo.notes && (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-semibold text-gray-700">Notes:</h3>
                    <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">{invoiceInfo.notes}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end space-x-3 px-6 py-4">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  onClick={SaveAsPDFHandler}
                >
                  Save as PDF
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                  onClick={addNextInvoiceHandler}
                >
                  Add Next Invoice
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default InvoiceModal;
