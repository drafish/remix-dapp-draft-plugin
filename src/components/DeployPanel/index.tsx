import React, { useState } from 'react';
import { Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

function DeployPanel(): JSX.Element {
  const [formVal, setFormVal] = useState({
    email: localStorage.getItem('__SURGE_EMAIL') || '',
    password: localStorage.getItem('__SURGE_PASSWORD') || '',
    subdomain: '',
  });
  const [deployState, setDeployState] = useState({ code: '', error: '' });
  const loading = useAppSelector((state) => state.loading['instance/deploy']);
  const dispatch = useAppDispatch();
  return (
    <div className="col-3 d-inline-block">
      <Button
        onClick={() => {
          dispatch({ type: 'instance/reset' });
        }}
      >
        Reset Functions
      </Button>
      <Button
        className="ml-3"
        onClick={() => {
          dispatch({ type: 'instance/empty' });
        }}
      >
        Delete Dapp
      </Button>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          setDeployState({ code: '', error: '' });
          dispatch({
            type: 'instance/deploy',
            payload: formVal,
            callback: (state: any) => {
              setDeployState(state);
            },
          });
        }}
      >
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Surge email"
            required
            value={formVal.email}
            onChange={(e) => {
              setFormVal({ ...formVal, email: e.target.value });
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Surge password"
            required
            value={formVal.password}
            onChange={(e) => {
              setFormVal({ ...formVal, password: e.target.value });
            }}
          />
        </Form.Group>
        <Form.Label>Subdomain</Form.Label>
        <InputGroup className="mb-3">
          <InputGroup.Text>https://</InputGroup.Text>
          <Form.Control
            type="subdomain"
            placeholder="Choose a subdomain"
            required
            value={formVal.subdomain}
            onChange={(e) => {
              setFormVal({ ...formVal, subdomain: e.target.value });
            }}
          />
          <InputGroup.Text>.surge.sh</InputGroup.Text>
        </InputGroup>
        <Button
          variant="primary"
          type="submit"
          disabled={!formVal.email || !formVal.password || !formVal.subdomain}
        >
          {loading && <i className="fas fa-spinner fa-spin mr-1"></i>}Deploy
        </Button>
        {deployState.code === 'SUCCESS' && (
          <Alert variant="success" className="mt-4">
            Deployed successfully! <br /> Click the link below to view your dapp
            <br />
            <a
              target="_blank"
              href={`https://${formVal.subdomain}.surge.sh`}
            >{`https://${formVal.subdomain}.surge.sh`}</a>
          </Alert>
        )}
        {deployState.error && (
          <Alert variant="danger" className="mt-4">
            {deployState.error}
          </Alert>
        )}
        <Alert variant="info" className="mt-4">
          Your Dapp will be deployed to Surge. Your email will be automatically
          registered as a Surge account, if it's not a Surge account yet. Click
          here to learn more about{' '}
          <a target="_blank" href="https://surge.sh/help/">
            surge.sh
          </a>
        </Alert>
      </Form>
    </div>
  );
}

export default DeployPanel;
