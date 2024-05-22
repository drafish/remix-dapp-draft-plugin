import React, { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { initInstance } from '../../actions';
import imgUrl from '../../assets/edit-dapp.png';

const CreateInstance: React.FC = () => {
  const [formVal, setFormVal] = useState({
    address: '',
    abi: [],
    name: '',
    network: '',
  });
  return (
    <Form
      className="w-50 m-auto"
      onSubmit={(e: any) => {
        e.preventDefault();
        initInstance({ ...formVal });
      }}
    >
      <Form.Group className="mb-3" controlId="formAddress">
        <Form.Label>address</Form.Label>
        <Form.Control
          type="address"
          placeholder="Enter address"
          value={formVal.address}
          onChange={(e) => {
            setFormVal({ ...formVal, address: e.target.value });
          }}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formAbi">
        <Form.Label>abi</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          type="abi"
          placeholder="Enter abi"
          value={formVal.abi.length > 0 ? JSON.stringify(formVal.abi) : ''}
          onChange={(e) => {
            let abi = [];
            try {
              abi = JSON.parse(e.target.value);
            } catch (error) {
              /* empty */
            }
            setFormVal({ ...formVal, abi });
          }}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formName">
        <Form.Label>name</Form.Label>
        <Form.Control
          type="name"
          placeholder="Enter name"
          value={formVal.name}
          onChange={(e) => {
            setFormVal({ ...formVal, name: e.target.value });
          }}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formNetwork">
        <Form.Label>network</Form.Label>
        <Form.Control
          type="network"
          placeholder="Enter network"
          value={formVal.network}
          onChange={(e) => {
            setFormVal({ ...formVal, network: e.target.value });
          }}
        />
      </Form.Group>
      <Button
        variant="primary"
        type="submit"
        disabled={
          !formVal.address ||
          !formVal.name ||
          !formVal.network ||
          !formVal.abi.length
        }
      >
        Submit
      </Button>
      <Alert className="mt-4" variant="info">
        Dapp Draft only work for Injected Provider currently. More providers
        will be adapted in further iterations.
        <br />
        Click the edit icon in a deployed contract will input the parameters
        automatically.
      </Alert>
      <img src={imgUrl} />
    </Form>
  );
};

export default CreateInstance;
