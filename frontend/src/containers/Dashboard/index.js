import React, { Fragment, Component } from "react";

import withResultData from "../withResultData";
import Filter from "../../components/Filter";
import Search from "../../components/Search";
import Summary from "../../components/Summary";
import VehicleList from "../../components/VehicleList";
import Results from "../../components/Results";
import Spinner from "../../components/Spinner";

import Fabs from "../../components/Fabs";

import { queryAll } from "../../api";
import {
  partial,
  vehicleTypesAccumulator,
  isValidRegNum,
  sortingByTotalFees,
  upperCase
} from "../../utils";
import {
  sortingOptions,
  SORTING,
  FILTER_TYPE,
  TYPE,
  LOAD_ALL,
  REFRESH,
  ALL
} from "../../constants";

import "./dashboard.css";

const SingleVehicle = partial(withResultData)(Results);

const initialState = {
  query: "",
  sorting: "None",
  filterType: "All",
  vehicles: [],
  loadingAll: false
};

export class Admin extends Component {
  state = {
    ...initialState
  };

  _input = React.createRef();

  search = () => {
    const { value } = this._input.current;
    const query = upperCase(value);

    return this.setState({ query: isValidRegNum(query) ? query : "" });
  };

  onChangeFilter = type => e => {
    const update = e.target.value;
    return this.setState({ [type]: update });
  };

  updateState = newState => this.setState({ ...newState });

  request = () => queryAll(this.updateState, initialState);

  loadAll = () => {
    return this.setState({ loadingAll: true }, this.request);
  };

  render() {
    const { vehicles, sorting, filterType, query, loadingAll } = this.state;

    const sortedVehicles = sortingByTotalFees(sorting, vehicles)
      .filter(({ type }) => filterType === ALL || type === filterType)
      .filter(({ regNum }) => !query || query === regNum);

    const typeOptions = [ALL, ...vehicleTypesAccumulator(vehicles)];
    const hasVehicles = !!vehicles.length;
    const showSingleView = hasVehicles && isValidRegNum(query);
    return (
      <Fragment>
        <div className="admin-container">
          <h1 id="admin" className="lead admin-title">
            Welcome!
          </h1>
          <div className="filters">
            <Search search={this.search} track={this._input} />
            <Filter
              title={TYPE}
              disabled={!!query}
              change={this.onChangeFilter(FILTER_TYPE)}
              options={typeOptions}
            />
            <Filter
              title={SORTING}
              change={this.onChangeFilter(SORTING)}
              options={sortingOptions}
            />
          </div>
          <Summary vehicles={vehicles} sortedVehicles={sortedVehicles} />
          {hasVehicles && <VehicleList vehicles={sortedVehicles} />}
          {showSingleView && SingleVehicle(sorting, sortedVehicles)}
        </div>
        <Fabs>
          <button
            className="btn btn-primary"
            onClick={this.loadAll}
            onMouseDown={e => e.preventDefault()}
          >
            {hasVehicles ? REFRESH : LOAD_ALL}
          </button>
        </Fabs>
        <Spinner show={loadingAll} />
      </Fragment>
    );
  }
}

export default Admin;