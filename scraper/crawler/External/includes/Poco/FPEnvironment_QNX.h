//
// FPEnvironment_QNX.h
//
// Library: Foundation
// Package: Core
// Module:  FPEnvironment
//
// Definitions of class FPEnvironmentImpl for QNX.
//
// Copyright (c) 2004-2006, Applied Informatics Software Engineering GmbH.
// and Contributors.
//
// SPDX-License-Identifier:	BSL-1.0
//


#ifndef Foundation_FPEnvironment_QNX_INCLUDED
#define Foundation_FPEnvironment_QNX_INCLUDED


#include "./Foundation.h"
#include <fenv.h>
#include <cmath>


namespace Poco {


class FPEnvironmentImpl
{
protected:
	enum RoundingModeImpl
	{
		FP_ROUND_DOWNWARD_IMPL   = FE_DOWNWARD,
		FP_ROUND_UPWARD_IMPL     = FE_UPWARD,
		FP_ROUND_TONEAREST_IMPL  = FE_TONEAREST,
		FP_ROUND_TOWARDZERO_IMPL = FE_TOWARDZERO
	};
	enum FlagImpl
	{
		FP_DIVIDE_BY_ZERO_IMPL = FE_DIVBYZERO,
		FP_INEXACT_IMPL        = FE_INEXACT,
		FP_OVERFLOW_IMPL       = FE_OVERFLOW,
		FP_UNDERFLOW_IMPL      = FE_UNDERFLOW,
		FP_INVALID_IMPL        = FE_INVALID
	};
	FPEnvironmentImpl();
	FPEnvironmentImpl(const FPEnvironmentImpl& env);
	~FPEnvironmentImpl();
	FPEnvironmentImpl& operator = (const FPEnvironmentImpl& env);
	void keepCurrentImpl();
	static void clearFlagsImpl();
	static bool isFlagImpl(FlagImpl flag);
	static void setRoundingModeImpl(RoundingModeImpl mode);
	static RoundingModeImpl getRoundingModeImpl();
	static bool isInfiniteImpl(float value);
	static bool isInfiniteImpl(double value);
	static bool isInfiniteImpl(long double value);
	static bool isNaNImpl(float value);
	static bool isNaNImpl(double value);
	static bool isNaNImpl(long double value);
	static float copySignImpl(float target, float source);
	static double copySignImpl(double target, double source);
	static long double copySignImpl(long double target, long double source);

private:
	fenv_t _env;
};


//
// inlines
//
inline bool FPEnvironmentImpl::isInfiniteImpl(float value)
{
	using namespace std;
	return isinf(value) != 0;
}


inline bool FPEnvironmentImpl::isInfiniteImpl(double value)
{
	using namespace std;
	return isinf(value) != 0;
}


inline bool FPEnvironmentImpl::isInfiniteImpl(long double value)
{
	using namespace std;
	return isinf((double) value) != 0;
}


inline bool FPEnvironmentImpl::isNaNImpl(float value)
{
	using namespace std;
	return isnan(value) != 0;
}


inline bool FPEnvironmentImpl::isNaNImpl(double value)
{
	using namespace std;
	return isnan(value) != 0;
}


inline bool FPEnvironmentImpl::isNaNImpl(long double value)
{
	using namespace std;
	return isnan((double) value) != 0;
}


inline float FPEnvironmentImpl::copySignImpl(float target, float source)
{
	using namespace std;
	return copysignf(target, source);
}


inline double FPEnvironmentImpl::copySignImpl(double target, double source)
{
	using namespace std;
	return copysign(target, source);
}


} // namespace Poco


#endif // Foundation_FPEnvironment_QNX_INCLUDED
