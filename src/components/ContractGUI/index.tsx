import React, { useEffect, useState } from 'react';
import { execution } from '@remix-project/remix-lib';
import { saveIntro, saveTitle } from '../../actions';

const txHelper = execution.txHelper;

const getFuncABIInputs = (funABI: any) => {
  if (!funABI.inputs) {
    return '';
  }
  return txHelper.inputParametersDeclarationToString(funABI.inputs);
};

export function ContractGUI(props: { funcABI: any }) {
  const isConstant =
    props.funcABI.constant !== undefined ? props.funcABI.constant : false;
  const lookupOnly =
    props.funcABI.stateMutability === 'view' ||
    props.funcABI.stateMutability === 'pure' ||
    isConstant;
  const inputs = getFuncABIInputs(props.funcABI);
  const [title, setTitle] = useState<string>('');
  const [buttonOptions, setButtonOptions] = useState<{
    title: string;
    content: string;
    classList: string;
    dataId: string;
  }>({ title: '', content: '', classList: '', dataId: '' });

  useEffect(() => {
    if (props.funcABI.name) {
      setTitle(props.funcABI.name);
    } else {
      setTitle(props.funcABI.type === 'receive' ? '(receive)' : '(fallback)');
    }
  }, [props.funcABI]);

  useEffect(() => {
    if (lookupOnly) {
      setButtonOptions({
        title: title + ' - call',
        content: 'call',
        classList: 'btn-info',
        dataId: title + ' - call',
      });
    } else if (
      props.funcABI.stateMutability === 'payable' ||
      props.funcABI.payable
    ) {
      setButtonOptions({
        title: title + ' - transact (payable)',
        content: 'transact',
        classList: 'btn-danger',
        dataId: title + ' - transact (payable)',
      });
    } else {
      setButtonOptions({
        title: title + ' - transact (not payable)',
        content: 'transact',
        classList: 'btn-warning',
        dataId: title + ' - transact (not payable)',
      });
    }
  }, [lookupOnly, props.funcABI, title]);

  return (
    <div className={`d-inline-block`} style={{ width: '90%' }}>
      <div className="p-2">
        <input
          className="form-control"
          placeholder="Enter a title for this function - if needed"
          defaultValue={props.funcABI.title}
          onBlur={(e) => {
            saveTitle({ id: props.funcABI.id, title: e.target.value });
          }}
        />
      </div>
      <div className="p-2 d-flex">
        <div
          className="d-flex btn p-0 wrapperElement"
          data-id={buttonOptions.dataId}
          data-title={buttonOptions.title}
        >
          <button
            disabled
            className={`text-nowrap overflow-hidden text-truncate btn btn-sm ${buttonOptions.classList}`}
            data-id={buttonOptions.dataId}
            data-title={buttonOptions.title}
            style={{ pointerEvents: 'none', width: 100 }}
          >
            {title}
          </button>
        </div>
        {props.funcABI.inputs && props.funcABI.inputs.length > 0 && (
          <input
            disabled
            className="form-control"
            data-id={'multiParamManagerBasicInputField'}
            placeholder={inputs}
            data-title={inputs}
          />
        )}
      </div>
      <div className="p-2">
        <textarea
          className="form-control"
          placeholder="Enter instructions for this function - if needed"
          defaultValue={props.funcABI.intro}
          onBlur={(e) => {
            saveIntro({ id: props.funcABI.id, intro: e.target.value });
          }}
        />
      </div>
    </div>
  );
}
