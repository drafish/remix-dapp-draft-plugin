import React, { useState } from 'react';
import { Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

function DeployPanel(): JSX.Element {
  const [formVal, setFormVal] = useState<any>({
    email: localStorage.getItem('__SURGE_EMAIL') || '',
    password: localStorage.getItem('__SURGE_PASSWORD') || '',
    subdomain: '',
    shortname: localStorage.getItem('__DISQUS_SHORTNAME') || '',
    shareTo: [],
  });
  const setShareTo = (type: string) => {
    let shareTo = formVal.shareTo;
    if (formVal.shareTo.includes(type)) {
      shareTo = shareTo.filter((item: string) => item !== type);
    } else {
      shareTo.push(type);
    }
    setFormVal({ ...formVal, shareTo });
  };
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
            placeholder="Unique subdomain name"
            required
            value={formVal.subdomain}
            onChange={(e) => {
              setFormVal({ ...formVal, subdomain: e.target.value });
            }}
          />
          <InputGroup.Text>.surge.sh</InputGroup.Text>
        </InputGroup>
        <Form.Group className="mb-3" controlId="formShortname">
          <Form.Label>Disqus Shortname (Optional)</Form.Label>
          <Form.Control
            type="shortname"
            placeholder="Disqus Shortname"
            value={formVal.shortname}
            onChange={(e) => {
              setFormVal({ ...formVal, shortname: e.target.value });
            }}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formShareTo">
          <Form.Label>Share To (Optional)</Form.Label>
          <div key="inline-checkbox" className="mb-3">
            <Form.Check
              inline
              label="Twitter"
              name="group1"
              type="checkbox"
              value="twitter"
              checked={formVal.shareTo.includes('twitter')}
              id="inline-checkbox-1"
              onChange={(e) => {
                setShareTo(e.target.value);
              }}
            />
            <Form.Check
              inline
              label="Facebook"
              name="group1"
              type="checkbox"
              value="facebook"
              checked={formVal.shareTo.includes('facebook')}
              id="inline-checkbox-2"
              onChange={(e) => {
                setShareTo(e.target.value);
              }}
            />
          </div>
        </Form.Group>
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
          Your DApp will be deployed to Surge.sh. If you do not have an account
          there, the email & password you input above will automatically
          register you with a Surge account. Surge accounts are free until you
          reach a level of use. The subdomain is your choice but it must be
          unique. Click here to learn more about. Click here to learn more about{' '}
          <a target="_blank" href="https://surge.sh/help/">
            surge.sh
          </a>
        </Alert>
      </Form>
    </div>
  );
}

export default DeployPanel;
