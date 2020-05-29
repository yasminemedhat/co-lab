import axios from "axios";
const axiosInstance = axios.create({
	baseURL: process.env.REACT_APP_baseAPIURL,
	withCredentials: false,
	timeout: 30000,
});

axiosInstance.interceptors.response.use(
	(res) => {
		return res;
	},
	(error) => {
		return Promise.reject(error.response);
	}
);

export const signup = (user) => {
	return axiosInstance.post("user/register", user).then((res) => {
		return res.data;
	});
};
export const login = (email, password) => {
	return axiosInstance
		.post("user/login", {
			email,
			password,
		})
		.then((res) => {
			console.log(res.data);
			return res.data;
		});
};
export const changePassword = (email) => {
	return axiosInstance
		.post("/user/resetPasswordRequest", { email: email })
		.then((res) => {
			return res.data;
		});
};

export const getUser = (jwt, id) => {
	return axiosInstance
		.get("user/profile/" + id, { headers: { Authorization: jwt } })
		.then((res) => {
			// axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${user.data.token}`;
			console.log("form api 2", res);
			return res.data;
		});
};

export const logout = (jwt, user) => {
	const headers = {
		Authorization: jwt,
	};
	return axiosInstance
		.post("user/logout", user, { headers: headers })
		.then((res) => {
			return res.data;
		});
};

export const createProject = (jwt, formData) => {
	const headers = {
		"Content-Type": "multipart/form-data",
		Authorization: jwt,
	};
	return axiosInstance
		.post("project/add", formData, { headers: headers })
		.then((res) => {
			return res;
		});
};
export const createCollaboration = (jwt, formData) => {
	const headers = {
		"Content-Type": "multipart/form-data",
		Authorization: jwt,
	};
	return axiosInstance
		.post("collaboration/create", formData, { headers: headers })
		.then((res) => {
			return res;
		});
};
export const createHire = (jwt, hire) => {
	return axiosInstance
		.post("quickHire/create", hire, { headers: { Authorization: jwt } })
		.then((res) => {
			console.log("form api getting quick hire ", res.data);
			return res;
		});
};

export const quickhireFeed = (jwt) => {
	return axiosInstance
		.get("quickHire/feed", { headers: { Authorization: jwt } })
		.then((res) => {
			console.log("form api getting quick-hire feed ", res.data);
			return res;
		});
};
export const viewHire = (hire_id) => {
	console.log(hire_id);
	return axiosInstance.get("quickHire/" + hire_id).then((res) => {
		console.log("form api viewing quick hire ", res.data);
		return res;
	});
};

export const acceptHire = (jwt, hire_id) => {
	const headers = {
		Authorization: jwt,
	};
	console.log(jwt);
	return axiosInstance
		.put("quickHire/accept/" + hire_id, hire_id, { headers: headers })
		.then((res) => {
			console.log("form api accepting quick hire ", res.data);
			return res;
		});
};

export const updateUser = (jwt, formData) => {
	const headers = {
		"Content-Type": "multipart/form-data",
		Authorization: jwt,
	};
	return axiosInstance
		.patch("user/update", formData, { headers: headers })
		.then((res) => {
			return res;
		});
};

export const updateCollaboration = (jwt, formData) => {
	const headers = {
		"Content-Type": "multipart/form-data",
		Authorization: jwt,
	};
	return axiosInstance
		.patch("collaboration/update", formData, { headers: headers })
		.then((res) => {
			return res;
		});
};

export const updateProject = (jwt, formData, projectId) => {
	const headers = {
		"Content-Type": "multipart/form-data",
		Authorization: jwt,
	};

	return axiosInstance
		.patch("project/update/" + projectId, formData, { headers: headers })
		.then((res) => {
			return res;
		});
};

export const getProjects = (jwt, userId) => {
	return axiosInstance
		.get("user/viewProjects/" + userId, { headers: { Authorization: jwt } })
		.then((res) => {
			// axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${user.data.token}`;
			console.log("form api getting projs ", res.data);
			return res.data;
		});
};
export const getNotifications = (jwt) => {
	return axiosInstance
		.get("user/pullNotifications", { headers: { Authorization: jwt } })
		.then((res) => {
			console.log("form api getting notifications ", res.data);
			return res.data;
		});
};

export const getColaberReviews = (userId) => {
	return axiosInstance.get("user/pullReviews/" + userId).then((res) => {
		console.log("form api getting colaber Reviews ", res.data);
		return res.data;
	});
};

export const getProjectReviews = (projectId) => {
	return axiosInstance.get("project/pullReviews/" + projectId).then((res) => {
		console.log("form api getting project Reviews ", res.data);
		return res.data;
	});
};

export const openNotification = (jwt, notificationId) => {
	return axiosInstance
		.get("user/openNotification/" + notificationId, {
			headers: { Authorization: jwt },
		})
		.then((res) => {
			return res.data;
		});
};
export const search = (text) => {
	console.log(text);
	return axiosInstance.get("user/search/" + text).then((res) => {
		console.log("form api getting searchResults ", res.data);
		return res.data;
	});
};

export const getProject = (jwt, projectId) => {
	return axiosInstance
		.get("project/" + projectId, { headers: { Authorization: jwt } })
		.then((res) => {
			return res.data;
		});
};

export const getCollaborations = (jwt, userId) => {
	return axiosInstance
		.get("user/getCollaborations/" + userId, {
			headers: { Authorization: jwt },
		})
		.then((res) => {
			// axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${user.data.token}`;
			console.log("form api getting colabs ", res.data);
			return res.data;
		});
};
export const getCollaboration = (jwt, colabId) => {
	return axiosInstance
		.get("collaboration/" + colabId, { headers: { Authorization: jwt } })
		.then((res) => {
			return res.data;
		});
};

export const addColabMember = (jwt, colabId, email) => {
	console.log(email);
	return axiosInstance
		.patch("collaboration/" + colabId + "/addColaber", email, {
			headers: { Authorization: jwt },
		})
		.then((res) => {
			return res.data;
		});
};

export const getInterestsList = () => {
	return axiosInstance.get("user/interestsList").then((res) => {
		return res.data;
	});
};

export const getHireFields = () => {
	return axiosInstance.get("user/fieldsList").then((res) => {
		console.log("form api getting hire Fields ", res.data);
		return res.data;
	});
};
export const followUser = (jwt, userId) => {
	return axiosInstance
		.put("user/follow/" + userId, userId, { headers: { Authorization: jwt } })
		.then((res) => {
			//the followed/unfollowed user
			return res.data;
		});
};

export const postColaberReview = (jwt, formdata, userId) => {
	const headers = {
		Authorization: jwt,
	};
	return axiosInstance
		.post("user/review/" + userId, formdata, { headers: headers })
		.then((res) => {
			//the followed/unfollowed user
			return res.data;
		});
};

export const postProjectReview = (jwt, formdata, projectId) => {
	const headers = {
		Authorization: jwt,
	};
	return axiosInstance
		.post("project/review/" + projectId, formdata, { headers: headers })
		.then((res) => {
			//the followed/unfollowed user
			return res.data;
		});
};

export const getHomePage = (jwt, lastSeen) => {
	if (lastSeen != null) {
		return axiosInstance
			.get("homepage?lastSeen=" + lastSeen, {
				headers: { Authorization: jwt },
			})
			.then((res) => {
				return res;
			});
	} else {
		return axiosInstance
			.get("homepage", { headers: { Authorization: jwt } })
			.then((res) => {
				return res;
			});
	}
};
export const discoverProjects = (jwt) => {
	return axiosInstance
		.get("user/discover/projects", { headers: { Authorization: jwt } })
		.then((res) => {
			return res;
		});
};

export const likeProject = (jwt, projectId) => {
	console.log("from api: ", jwt, "id ", projectId);
	return axiosInstance
		.put("project/like/" + projectId, projectId, {
			headers: { Authorization: jwt },
		})
		.then((res) => {
			//the followed/unfollowed user
			return res.data;
		});
};

export const getChatHistory = (jwt, colabId) => {
	return axiosInstance
		.get("collaboration/" + colabId + "/messages", {
			headers: { Authorization: jwt },
		})
		.then((res) => {
			return res.data;
		});
};
export const sendChatMessage = (jwt, colabId, message) => {
	return axiosInstance
		.post("collaboration/" + colabId + "/message", message, {
			headers: { Authorization: jwt },
		})
		.then((res) => {
			return res.data;
		});
};
